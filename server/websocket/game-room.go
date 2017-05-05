package websocket

import (
	"log"
)

type Room struct {
	Id      string
	Players map[string]bool
}

func NewRoom(id string) *Room {

	// Add player to the room
	return &Room{
		Id:      id,
		Players: make(map[string]bool),
	}
}

func (r *Room) Run() {
}

func (r *Room) AddPlayer(identifier string) {

	err := GetEngine().redis.HSet("rooms:"+r.Id+":players:"+identifier, "identifier", identifier).Err()
	if err != nil {
		log.Println("Error while adding a user to the room --"+"rooms:"+r.Id+":players:"+identifier, err)
	}

	GetEngine().redis.HSet("rooms:"+r.Id+":players:"+identifier, "score", 0);
	GetEngine().redis.HSet("player:"+identifier, "roomId", r.Id)

	r.Players[identifier] = true;
}

func (r *Room) RemovePlayer(identifier string) {
	GetEngine().redis.HDel("rooms:"+r.Id+":players:"+identifier, "identifier", "score")
	GetEngine().redis.HDel("player:"+identifier, "roomId")
	delete(r.Players, identifier);
}

// Returns a slice with players in this room along with all the data
func (r *Room) GetPlayers() map[string]interface{} {

	players :=  make(map[string]interface{});

	// Iterate over all the players
	for identifier := range r.Players {
		// Get the current player from Redis
		players[identifier] = GetEngine().redis.HGetAll("rooms:"+r.Id+":players:"+identifier).Val();
	}

	return players;
}

// Returns a slice with players in this room along with all the data
func (r *Room) GetPlayer(identifier string) map[string]string {
	return GetEngine().redis.HGetAll("rooms:"+r.Id+":players:"+identifier).Val()
}

// Sends a message to the members of this room
func (r *Room) SendMessage(messageType string, message interface{}) bool {

	allOk := true;
	for identifier, _ := range r.Players {
		ok := GetHub().SendMessageToClient(
			identifier,
			messageType,
			message,
		);
		if !ok {
			allOk = false;
		}
	}

	return allOk;
}
