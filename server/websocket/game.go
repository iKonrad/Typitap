package websocket

import (
	"log"
	"sync"

	"github.com/go-redis/redis"
	"github.com/iKonrad/typitap/server/config"
	"github.com/pkg/errors"
)

type Engine struct {
	redis          *redis.Client
	rooms          map[string]*Room
	newRoomChannel chan *Room
}

const (
	ROOM_EXPIRY_TIME = 3600 * 24
	TYPE_LEFT_ROOM = "LEFT_ROOM" // Sent to user after successful room leaving
	TYPE_JOINED_ROOM = "JOINED_ROOM"
	TYPE_PLAYER_JOINED_ROOM = "PLAYER_JOINED_ROOM"
	TYPE_PLAYER_LEFT_ROOM = "PLAYER_LEFT_ROOM"
)

var engine *Engine
var engineOnce sync.Once

func GetEngine() *Engine {
	engineOnce.Do(func() {
		engine = &Engine{
			rooms:          make(map[string]*Room),
			newRoomChannel: make(chan *Room),
			redis: redis.NewClient(&redis.Options{
				Addr:     config.GetString("redis_host"),
				Password: "",                                 // no password set
				DB:       config.Get("redis_database").(int), // use default DB
			}),
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
			log.Println("ROOMS", e.rooms)
		}
	}

}

// Picks up the received message and checks if game module needs to respond to it
func (e *Engine) parseMessage(identifier string, message map[string]interface{}) {

	switch message["type"] {
	case "JOIN_ROOM":
		roomId, ok := message["room"]
		if ok {
			if ok = GetEngine().handleJoinRoom(identifier, roomId.(string)); ok {
			} else {
				GetHub().SendMessageToClient(
					identifier,
					TYPE_ERROR,
					map[string]interface{}{
						"error": "An error occurred while joining the room",
					},
				)
			}
		} else {
			GetHub().SendMessageToClient(
				identifier,
				TYPE_ERROR,
				map[string]interface{}{
					"error": "Room ID is missing",
				},
			)
		}
	case "LEAVE_ROOM":
		err := e.handleLeaveRoom(identifier);
		if err != nil {
			log.Println("Leave room issue", err);
			GetHub().SendMessageToClient(
				identifier,
				TYPE_ERROR,
				map[string]interface{}{
					"error": "Could not leave room",
				},
			)
		} else {
			GetHub().SendMessageToClient(
				identifier,
				TYPE_LEFT_ROOM,
				map[string]interface{}{},
			)
		}
	}

}

// Handles the player leaving the room
func (e *Engine) handleLeaveRoom(identifier string) error {

	roomId, ok := e.getRoomForClientId(identifier);

	if ok {
		e.rooms[roomId].RemovePlayer(identifier);

		// Send message to everyone that the player has joined the room
		e.rooms[roomId].SendMessage(TYPE_PLAYER_LEFT_ROOM, map[string]interface{}{
			"identifier": identifier,
		});

		return nil;
	}

	return errors.New("Room with ID " + roomId + " has not been found")
}


// Adds client ID to the room if exists. If no room is found, it creates a new one
func (e *Engine) handleJoinRoom(identifier string, sessionId string) bool {

	// Check if there's a room for that session
	exists := e.roomExists(sessionId)

	var room *Room
	if !exists {
		// Room doesn't exists, create a new one
		room = NewRoom(sessionId)
		e.newRoomChannel <- room
	} else {
		room = e.rooms[sessionId]
	}

	// Add player to the room
	room.AddPlayer(identifier)

	// Send message to the new player with a list of players
	GetHub().SendMessageToClient(
		identifier,
		TYPE_JOINED_ROOM,
		map[string]interface{}{
			"roomId": room.Id,
			"players": room.GetPlayers(), // @TODO: Return list of players in the room
		},
	)

	playerData := room.GetPlayer(identifier);

	// Send message to everyone that the player has joined the room
	room.SendMessage(TYPE_PLAYER_JOINED_ROOM, map[string]interface{}{
		"player": playerData,
	});

	return true
}

// Helper function that fetches the RoomID (SessionID) for a given Client identifier
func (e *Engine) getRoomForClientId(identifier string) (sessionId string, ok bool) {

	sessionId = e.redis.HGet("player:"+identifier, "roomId").Val();
	ok = false

	if e.roomExists(sessionId) {
		ok = true
	}

	return;
}

// Helper method that checks if room exists for given ID
func (e *Engine) roomExists(sessionId string) bool {
	if len(e.rooms) == 0 {
		return false
	}
	_, ok := e.rooms[sessionId]
	return ok
}

