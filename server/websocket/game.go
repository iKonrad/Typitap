package websocket

import (
	"log"
	"sync"

	"github.com/go-redis/redis"
	"github.com/iKonrad/typitap/server/config"
	"github.com/iKonrad/typitap/server/entities"
	"github.com/iKonrad/typitap/server/manager"
)

type Engine struct {
	redis          *redis.Client
	rooms          map[string]*Room
	newRoomChannel chan *Room
}

const (
	ROOM_EXPIRY_TIME = 3600 * 24
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

func (e *Engine) parseMessage(identifier string, message map[string]interface{}) {

	switch message["type"] {
	case "JOIN_ROOM":
		roomId, ok := message["room"]
		if ok {
			GetEngine().JoinRoom(identifier, roomId.(string))
		} else {
			GetHub().SendMessageToClient(
				identifier,
				TYPE_ERROR,
				map[string]string{
					"error": "Room ID is missing",
				},
			)
		}
	}

}

func (e *Engine) findOpenSession(user *entities.User) (entities.GameSession, error) {

	// Get online session if there's any open
	session, ok := manager.Game.FindOpenSession(true, user)
	if !ok {
		session, _ = manager.Game.CreateSession( true, user);
	}

	return session, nil
}

func (e *Engine) JoinRoom(identifier string, sessionId string) bool {

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
	return true
}

func (e *Engine) roomExists(sessionId string) bool {
	if len(e.rooms) == 0 {
		return false
	}
	_, ok := e.rooms[sessionId]
	return ok
}
