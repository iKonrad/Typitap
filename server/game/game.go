package game

import (
	"sync"
	"github.com/go-redis/redis"
	"github.com/iKonrad/typitap/server/config"
	"github.com/iKonrad/typitap/server/entities"
	"github.com/iKonrad/typitap/server/manager"
	"log"
	"strings"
)

type Engine struct {
	redis    *redis.Client
	roomChannel chan map[string]string // Client identifier => Room Id
}

const (
	ROOM_EXPIRY_TIME = 3600
)

var engine *Engine
var once sync.Once

func GetEngine() *Engine {
	once.Do(func() {
		engine = &Engine{
			redis: redis.NewClient(&redis.Options{
				Addr:     config.GetString("redis_host"),
				Password: "",                                 // no password set
				DB:       config.Get("redis_database").(int), // use default DB
			}),
		}
	})
	return engine
}



func (e *Engine) findOpenSession(user *entities.User) (entities.GameSession, error) {

	// Get online session if there's any open
	session, err := manager.Game.GetOnlineSession(user);
	if err != nil {
		return entities.GameSession{}, err;
	}

	return session, nil;
}

func (e *Engine) EnrolUserToSession(identifier string) (bool) {

	// Check if identifier belongs to any user
	// First, check if username starts with guest-
	var user entities.User;
	if !strings.HasPrefix(identifier, "guest-") {
		// User is logged in - get the user and pass it to the function
		userFound, ok := manager.User.FindUserBy("username", identifier);
		if ok {
			// User found - assign it now
			user = userFound
		}
	}

	// Get the next open session
	session, err := manager.Game.GetOnlineSession(&user);
	if err != nil {
		log.Println("Error while fetching an online session", err);
		return false;
	}

	// Check if there's a room for that session
	exists := e.roomExists(session.Id);

	//val2, err := client.Get("key2").Result()

	if !exists {
		// Room doesn't exists, create a new one
		e.createNewRoom(session.Id);
	}


	// Add identifier to the current room
	e.addPlayerToRoom(session.Id, identifier);

	return true;

}


func (e *Engine) roomExists (sessionId string) bool {

	val := e.redis.HGet("rooms:" + sessionId, "id").String();
	return val != ""

}

func (e *Engine) createNewRoom(sessionId string) bool {

	// Add sessionId to the room value
	err := e.redis.HSet("rooms:" + sessionId, "id", sessionId).Err();

	if err != nil {
		log.Println(err);
		return false
	}

	// Set the expiry time for a
	e.redis.Expire("rooms:" + sessionId, ROOM_EXPIRY_TIME)
	return true
}


// Adds a player hash to the room object
func (e *Engine) addPlayerToRoom(sessionId string, clientIdentifier string) bool {

	// Check if room exists
	if !e.roomExists(sessionId) {
		log.Println("Attempting to add player to room that doesn't exists");
		return false;
	}

	// Add player to the room
	err := e.redis.HSet("rooms:" + sessionId + ":players:" + clientIdentifier, "id", clientIdentifier).Err();

	if err != nil {
		log.Println("Error while adding a user to the room --" + "rooms:" + sessionId + ":players:" + clientIdentifier, err);
		return false;
	}

	e.redis.Expire("rooms:" + sessionId + ":players:" + clientIdentifier, ROOM_EXPIRY_TIME)

	// Now, we need to add player-room association to the index
	e.redis.HSet("player:" + clientIdentifier, "roomId", sessionId);
	return true;

}




