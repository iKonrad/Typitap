package websocket

import (
	"log"
)

type Room struct {
	Id string

}

func NewRoom(id string) *Room {

	// Add player to the room
	return &Room {
		Id: id,
	}
}

func (r *Room) Run() {
}

func (r *Room) AddPlayer(identifier string) {
	log.Println("BEFORE REDIS");


	log.Println("REDIS", r);

	err := GetEngine().redis.HSet("rooms:"+r.Id+":players:"+identifier, "id", identifier).Err()
	if err != nil {
		log.Println("Error while adding a user to the room --"+"rooms:"+r.Id+":players:"+identifier, err)
	}

	GetEngine().redis.HSet("rooms:"+r.Id+":players:"+identifier, "score", 0);
	GetEngine().redis.HSet("player:"+identifier, "roomId", r.Id)
}

func (r *Room) RemovePlayer(identifier string) {
	GetEngine().redis.HDel("rooms:"+r.Id+":players:"+identifier, "id", "score")
	GetEngine().redis.HDel("player:"+identifier, "roomId")
}



