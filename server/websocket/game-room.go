package websocket

import (
	"log"
	"time"

	"github.com/iKonrad/typitap/server/manager"
)

type Room struct {
	Id                   string
	Players              map[string]bool
	countdownTicker      *time.Ticker
	countdownSeconds     int8
	countdownStarted     bool
	waitCountdownSeconds int8
	waitCountdownStarted bool
}

func NewRoom(id string) *Room {

	GetEngine().redis.HSet("rooms:"+id, "started", false)

	// Add player to the room
	return &Room{
		Id:                   id,
		Players:              make(map[string]bool),
		countdownSeconds:     0,
		countdownStarted:     false,
		waitCountdownSeconds: 0,
		waitCountdownStarted: false,
	}
}

func (r *Room) Run() {
}

func (r *Room) AddPlayer(identifier string) {

	err := GetEngine().redis.HSet("rooms:"+r.Id+":players:"+identifier, "identifier", identifier).Err()
	if err != nil {
		log.Println("Error while adding a user to the room --"+"rooms:"+r.Id+":players:"+identifier, err)
	}

	GetEngine().redis.HSet("rooms:"+r.Id+":players:"+identifier, "score", 0)
	GetEngine().redis.HSet("player:"+identifier, "roomId", r.Id)

	r.Players[identifier] = true
}

func (r *Room) RemovePlayer(identifier string) {
	GetEngine().redis.HDel("rooms:"+r.Id+":players:"+identifier, "identifier", "score")
	GetEngine().redis.HDel("player:"+identifier, "roomId")
	delete(r.Players, identifier)
}

// Returns a slice with players in this room along with all the data
func (r *Room) GetPlayers() map[string]interface{} {

	players := make(map[string]interface{})

	// Iterate over all the players
	for identifier := range r.Players {
		// Get the current player from Redis
		players[identifier] = GetEngine().redis.HGetAll("rooms:" + r.Id + ":players:" + identifier).Val()
	}

	return players
}

// Returns a slice with players in this room along with all the data
func (r *Room) GetPlayer(identifier string) map[string]string {
	return GetEngine().redis.HGetAll("rooms:" + r.Id + ":players:" + identifier).Val()
}

// Sends a message to the members of this room
func (r *Room) SendMessage(messageType string, message interface{}) bool {

	allOk := true
	for identifier, _ := range r.Players {
		ok := GetHub().SendMessageToClient(
			identifier,
			messageType,
			message,
		)
		if !ok {
			allOk = false
		}
	}

	return allOk
}

func (r *Room) canStartGame() bool {
	return len(r.Players) > 1
}

func (r *Room) restartWaitCountdown() {

	r.SendMessage(
		TYPE_START_WAIT_COUNTDOWN,
		map[string]interface{}{
			"seconds": 10,
		},
	)

	if r.waitCountdownStarted {
		r.countdownTicker.Stop();
	}

	r.countdownTicker = time.NewTicker(time.Millisecond * 1000)
	r.waitCountdownStarted = true
	r.waitCountdownSeconds = 10

	go func() {
		for range r.countdownTicker.C {
			r.waitCountdownSeconds--
			if r.waitCountdownSeconds > 0 {
				r.SendMessage(TYPE_TICK_WAIT_COUNTDOWN, map[string]interface{}{
					"seconds": r.waitCountdownSeconds,
				})

			} else {
				r.stopWaitCountdown()
				// Double check if all players are in the session and start the game
				if len(r.Players) > 1 {
					// Mark the room as closed so noone else can join
					manager.Game.CloseGameSession(r.Id)
					r.startCountdown()
				}
			}
		}
	}()
}

func (r *Room) stopWaitCountdown() {

	r.SendMessage(
		TYPE_STOP_WAIT_COUNTDOWN,
		map[string]interface{}{},
	)
	r.countdownTicker.Stop()
	r.waitCountdownStarted = false
	r.waitCountdownSeconds = 0

}

func (r *Room) startCountdown() {

	r.SendMessage(
		TYPE_START_COUNTDOWN,
		map[string]interface{}{
			"seconds": 3,
		},
	)

	r.countdownTicker = time.NewTicker(time.Millisecond * 1000)
	r.countdownStarted = true
	r.countdownSeconds = 3
	go func() {
		for range r.countdownTicker.C {
			r.countdownSeconds--
			if r.countdownSeconds > 0 {
				r.SendMessage(TYPE_TICK_COUNTDOWN, map[string]interface{}{
					"seconds": r.countdownSeconds,
				})

			} else {
				r.countdownStarted = false
				r.countdownTicker.Stop()
				// Double check if all players are in the session and start the game
				if len(r.Players) > 1 {
					r.startGame()
				} else {
					r.stopCountdown()
				}

			}
		}
	}()

}

func (r *Room) stopCountdown() {
	if r.countdownTicker != nil && r.countdownStarted {
		r.SendMessage(
			TYPE_STOP_COUNTDOWN,
			map[string]interface{}{},
		)
		r.countdownTicker.Stop()
		r.countdownStarted = false
		r.countdownSeconds = 0
	}
}

func (r *Room) startGame() {

	r.SendMessage(
		TYPE_START_GAME,
		map[string]interface{}{},
	)

}

func (r *Room) finishGame() {
	r.SendMessage(
		TYPE_FINISH_GAME,
		map[string]interface{}{},
	)
}
