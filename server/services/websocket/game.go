package websocket

import (
	"log"
	"sync"

	db "github.com/iKonrad/typitap/server/services/database"
	"github.com/iKonrad/typitap/server/services/game"
	"github.com/iKonrad/typitap/server/services/logs"
	"github.com/pkg/errors"
	"encoding/json"
)

type Engine struct {
	rooms          map[string]*Room
	newRoomChannel chan *Room
}

const (
	ROOM_EXPIRY_TIME        = 3600 * 24
	TYPE_LEFT_ROOM          = "LEFT_ROOM" // Sent to user after successful room leaving
	TYPE_JOINED_ROOM        = "JOINED_ROOM"
	TYPE_PLAYER_JOINED_ROOM = "PLAYER_JOINED_ROOM"
	TYPE_PLAYER_LEFT_ROOM   = "PLAYER_LEFT_ROOM"

	TYPE_PLAYER_COMPLETED_GAME = "PLAYER_COMPLETED_GAME"
	TYPE_START_COUNTDOWN       = "START_COUNTDOWN"
	TYPE_STOP_COUNTDOWN        = "STOP_COUNTDOWN"
	TYPE_TICK_COUNTDOWN        = "TICK_COUNTDOWN"

	TYPE_START_WAIT_COUNTDOWN = "START_WAIT_COUNTDOWN"
	TYPE_STOP_WAIT_COUNTDOWN  = "STOP_WAIT_COUNTDOWN"
	TYPE_TICK_WAIT_COUNTDOWN  = "TICK_WAIT_COUNTDOWN"

	TYPE_START_GAME          = "START_GAME"
	TYPE_FINISH_GAME         = "FINISH_GAME"
	TYPE_UPDATE_PLAYERS_DATA = "UPDATE_PLAYERS_DATA"

	WAIT_SECONDS        = 3   // How many seconds should the room count down for other players
	FINISH_GAME_SECONDS = 120 // How many seconds must pass before the game automatically closes
)

var engine *Engine
var engineOnce sync.Once

func GetEngine() *Engine {
	engineOnce.Do(func() {
		engine = &Engine{
			rooms:          make(map[string]*Room),
			newRoomChannel: make(chan *Room),
		}

	})
	return engine
}

func (e *Engine) Run() {

	for {
		select {
		case r := <-e.newRoomChannel:
			log.Println("Adding new room", r)
			e.rooms[r.Id] = r
		}
	}

}

// Picks up the received message and checks if game module needs to respond to it
func (e *Engine) parseMessage(client *Client, message map[string]interface{}) {

	switch message["type"] {

	case "JOIN_ROOM":
		online, ok := message["online"]
		if !ok {
			online = false
		}

		var roomId string
		if roomId, ok = GetEngine().handleJoinRoom(client.identifier, online.(bool)); ok {
			logs.Log("Player joined room", "Player "+client.identifier+" joined room "+roomId, []string{"websocket", "game", "players"}, "Game Session "+roomId)
		}

	case "LEAVE_ROOM":
		err := e.handleLeaveRoom(client.identifier)
		if err != nil {
			log.Println("Leave room issue", err)
			GetHub().SendMessageToClient(
				client.identifier,
				TYPE_ERROR,
				map[string]interface{}{
					"error": "Could not leave room",
				},
			)
		} else {
			GetHub().SendMessageToClient(
				client.identifier,
				TYPE_LEFT_ROOM,
				map[string]interface{}{},
			)
		}

	case "UPDATE_PLAYER_DATA":
		if score, ok := message["score"]; ok {
			if roomId, ok := e.getRoomForClientId(client.identifier); ok {
				e.rooms[roomId].handlePlayerUpdate(client.identifier, score.(float64))
			}
		}

	case "COMPLETE_PLAYER_GAME":
		if roomId, ok := e.getRoomForClientId(client.identifier); ok {

			var mistakes = make(map[string]int)
			m := message["mistakes"]
			for i, v := range m.(map[string]interface{}) {
				mistakes[i] = int(v.(float64))
			}

			var playback = []map[string]interface{}{}
			json.Unmarshal([]byte(message["playback"].(string)), &playback)

			e.rooms[roomId].handlePlayerCompleted(client.identifier, mistakes, playback, client.ip, client.country)

			// Check if all players completed game. If yes, then shut the timer and remove the room
			if e.rooms[roomId].haveAllPlayersCompletedGame() {
				e.RemoveRoom(roomId)
			}
		}
		break
	}

}

// Adds client ID to the room if exists. If no room is found, it creates a new one
func (e *Engine) handleJoinRoom(identifier string, online bool) (string, bool) {

	// Get the next session
	session, ok := game.FindOpenSession(online)
	if !ok {
		var err error
		session, err = game.CreateSession(online)
		if err != nil {
			GetHub().SendMessageToClient(
				identifier,
				TYPE_ERROR,
				map[string]interface{}{
					"error": "An error occurred while joining the room",
				},
			)
			return "", false
		}
	}

	// If the session is offline, send the message back to the client with sessionId
	if !online {
		// Send message to the new player with a list of players
		GetHub().SendMessageToClient(
			identifier,
			TYPE_JOINED_ROOM,
			map[string]interface{}{
				"roomId": session.Id,
				"text":   session.Text.Text,
			},
		)
		return session.Id, true
	}

	// For online game, join the room or create a new one
	// Check if there's a room for that session
	exists := e.roomExists(session.Id)

	var room *Room
	if !exists {
		// Room doesn't exists, create a new one
		room = NewRoom(session.Id, session.Text.Text)
		e.newRoomChannel <- room
		logs.Log("New room created", "Room '"+room.Id+"' has been created", []string{"websocket", "game"}, "Game Session "+room.Id)
		logs.Gauge("rooms", float64(len(e.rooms)), []string{"websocket", "game"})
	} else {
		room = e.rooms[session.Id]
	}

	// Add player to the room
	room.AddPlayer(identifier)

	// If room is full, close the room
	log.Println("Player joined. Players now:", len(room.Players))
	if len(room.Players) >= 5 {
		game.CloseGameSession(room.Id)
		logs.Success("Room is full", "Room '"+room.Id+"' is full and has been closed", []string{"websocket", "game"}, "Game Session "+room.Id)
	}

	// Send message to the new player with a list of players and game text
	GetHub().SendMessageToClient(
		identifier,
		TYPE_JOINED_ROOM,
		map[string]interface{}{
			"roomId":  room.Id,
			"players": room.GetPlayers(), // @TODO: Return list of players in the room
			"text":    session.Text.Text,
		},
	)

	// Send message to everyone that the player has joined the room
	playerData := room.GetPlayer(identifier)
	room.SendMessage(TYPE_PLAYER_JOINED_ROOM, map[string]interface{}{
		"player": playerData,
	})

	// Start the countdown if amount of players is at least 2
	if len(room.Players) > 1 {
		room.restartWaitCountdown()
	}
	return room.Id, true
}

// Handles the player leaving the room
func (e *Engine) handleLeaveRoom(identifier string) error {

	roomId, ok := e.getRoomForClientId(identifier)
	if ok {

		var shouldOpen = len(e.rooms[roomId].Players) >= 5
		e.rooms[roomId].RemovePlayer(identifier)

		// Send message to everyone that the player has joined the room
		e.rooms[roomId].SendMessage(TYPE_PLAYER_LEFT_ROOM, map[string]interface{}{
			"identifier": identifier,
		})
		log.Println("Player left. Now players: ", len(e.rooms[roomId].Players))
		if shouldOpen {
			log.Println("Opening back the session")
			game.OpenGameSession(roomId)
		}

		// If there's less than 2 players, stop the countdown ticker if it runs
		if len(e.rooms[roomId].Players) < 2 {
			e.rooms[roomId].stopWaitCountdown()
		}

		if len(e.rooms[roomId].Players) < 1 {
			e.RemoveRoom(roomId)
		}

		logs.Log("Player left room", "Player "+identifier+" left room", []string{"websocket", "game", "players"}, "Game Session "+roomId)

		return nil
	}
	return errors.New("Room with ID " + roomId + " has not been found")
}

// Helper function that fetches the RoomID (SessionID) for a given Client identifier
func (e *Engine) getRoomForClientId(identifier string) (sessionId string, ok bool) {

	sessionId = db.Redis.HGet("player:"+identifier, "roomId").Val()
	ok = false

	if e.roomExists(sessionId) {
		ok = true
	}

	return
}

// Helper method that checks if room exists for given ID
func (e *Engine) roomExists(sessionId string) bool {
	if len(e.rooms) == 0 {
		return false
	}
	_, ok := e.rooms[sessionId]
	return ok
}

func (e *Engine) GetRoom(sessionId string) (*Room, bool) {

	if !e.roomExists(sessionId) {
		return &Room{}, false
	}

	return e.rooms[sessionId], true

}

func (e *Engine) RemoveRoom(roomId string) {
	logs.Log("Closing room", "Room "+roomId+" has been closed", []string{"websocket", "game", "players"}, "Game Session "+roomId)
	logs.Gauge("rooms", float64(len(e.rooms)), []string{"websocket", "game"})
	e.rooms[roomId].finishGame()
	game.MarkSessionFinished(roomId)
	delete(e.rooms, roomId)
}
