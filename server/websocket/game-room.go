package websocket

import (
	"log"
	"time"

	"github.com/go-redis/redis"
	"github.com/iKonrad/typitap/server/manager"
	"github.com/iKonrad/typitap/server/logs"
	"strconv"
	db "github.com/iKonrad/typitap/server/database"
	"github.com/iKonrad/typitap/server/game/topchart"
)

type Room struct {
	Id                   string
	Players              map[string]bool
	ticker               *time.Ticker
	countdownSeconds     int8
	countdownStarted     bool
	waitCountdownSeconds int8
	waitCountdownStarted bool
	gameStarted          bool
	nextPlace            int8
	time                 int8
}

func NewRoom(id string, text string) *Room {

	db.Redis.HSet("rooms:"+id, "started", false)

	db.Redis.HSet("rooms:"+id, "text", text);

	// Add player to the room
	return &Room{
		Id:                   id,
		Players:              make(map[string]bool),
		countdownSeconds:     0,
		countdownStarted:     false,
		waitCountdownSeconds: 0,
		waitCountdownStarted: false,
		gameStarted:          false,
		nextPlace:            1,
		time:                 0,
	}
}

func (r *Room) Run() {
}

// Adds a new player to the room
func (r *Room) AddPlayer(identifier string) {

	err := db.Redis.HSet("rooms:"+r.Id+":players:"+identifier, "identifier", identifier).Err()
	if err != nil {
		log.Println("Error while adding a user to the room --"+"rooms:"+r.Id+":players:"+identifier, err)
	}

	pipeline := db.Redis.Pipeline()
	defer pipeline.Close()
	pipeline.HSet("rooms:"+r.Id+":players:"+identifier, "score", 0)
	pipeline.HSet("rooms:"+r.Id+":players:"+identifier, "place", 0)
	pipeline.HSet("rooms:"+r.Id+":players:"+identifier, "completed", false)
	pipeline.HSet("player:"+identifier, "roomId", r.Id)
	_, err = pipeline.Exec()
	r.Players[identifier] = true
}

// Removes player from the room
func (r *Room) RemovePlayer(identifier string) {
	db.Redis.HDel("rooms:"+r.Id+":players:"+identifier, "identifier", "score")
	db.Redis.HDel("player:"+identifier, "roomId")
	delete(r.Players, identifier)
}

// Returns a slice with players in this room along with all the data
func (r *Room) GetPlayers() map[string]interface{} {

	players := make(map[string]interface{})

	// Iterate over all the players
	for identifier := range r.Players {
		// Get the current player from Redis
		players[identifier] = db.Redis.HGetAll("rooms:" + r.Id + ":players:" + identifier).Val()
	}

	return players
}

// Returns a slice with players in this room along with all the data
func (r *Room) GetPlayer(identifier string) map[string]string {
	return db.Redis.HGetAll("rooms:" + r.Id + ":players:" + identifier).Val()
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

// Resets the wait countdown (for example, when a new player enters the room)
func (r *Room) restartWaitCountdown() {

	r.SendMessage(
		TYPE_START_WAIT_COUNTDOWN,
		map[string]interface{}{
			"seconds": WAIT_SECONDS,
		},
	)

	if r.waitCountdownStarted {
		r.ticker.Stop()
	}

	r.ticker = time.NewTicker(time.Millisecond * 1000)
	r.waitCountdownStarted = true
	r.waitCountdownSeconds = WAIT_SECONDS

	go func() {
		for range r.ticker.C {
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

// Stops the countdown when waiting for players
func (r *Room) stopWaitCountdown() {

	if r.ticker != nil && r.waitCountdownStarted {
		r.SendMessage(
			TYPE_STOP_WAIT_COUNTDOWN,
			map[string]interface{}{},
		)
		r.ticker.Stop()
		r.waitCountdownStarted = false
		r.waitCountdownSeconds = 0
	}

}

// Starts the final game countdown
func (r *Room) startCountdown() {

	r.SendMessage(
		TYPE_START_COUNTDOWN,
		map[string]interface{}{
			"seconds": 3,
		},
	)

	r.ticker = time.NewTicker(time.Millisecond * 1000)
	r.countdownStarted = true
	r.countdownSeconds = 3
	go func() {
		for range r.ticker.C {
			r.countdownSeconds--
			if r.countdownSeconds > 0 {
				r.SendMessage(TYPE_TICK_COUNTDOWN, map[string]interface{}{
					"seconds": r.countdownSeconds,
				})

			} else {
				r.countdownStarted = false
				r.ticker.Stop()
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

// Stops and resets the game countdown
func (r *Room) stopCountdown() {
	if r.ticker != nil && r.countdownStarted {
		r.SendMessage(
			TYPE_STOP_COUNTDOWN,
			map[string]interface{}{},
		)
		r.ticker.Stop()
		r.countdownStarted = false
		r.countdownSeconds = 0
	}
}

// Runs the game timer and sends periodic updates to the players
func (r *Room) startGame() {

	// Can't start game if room is in the countdown state
	if r.waitCountdownStarted || r.countdownStarted {
		return
	}

	r.gameStarted = true
	r.time = 0
	r.ticker = time.NewTicker(time.Millisecond * 1000)

	logs.Log(
		"Starting game",
		"Game in room "+r.Id+" has started",
		[]string{"websocket", "game"},
		"Game Session "+r.Id,
	);
	go func() {
		for range r.ticker.C {
			r.time++
			playersData := r.getPlayersData()
			r.SendMessage(
				TYPE_UPDATE_PLAYERS_DATA,
				map[string]interface{}{
					"players": playersData,
				},
			)

			if r.time == FINISH_GAME_SECONDS {
				r.SendMessage(TYPE_FINISH_GAME, map[string]interface{}{});
				GetEngine().RemoveRoom(r.Id);
			}
		}
	}()

	r.SendMessage(
		TYPE_START_GAME,
		map[string]interface{}{},
	)

}

// Gets the game data and player scores
func (r *Room) getPlayersData() map[string]interface{} {
	// Create a pipeline to get data for all players
	pipeline := db.Redis.Pipeline()
	defer pipeline.Close()
	playerResults := make(map[string]*redis.StringStringMapCmd)
	for identifier := range r.Players {
		playerResults[identifier] = pipeline.HGetAll("rooms:" + r.Id + ":players:" + identifier)
	}

	_, err := pipeline.Exec()
	if err != nil {
		log.Println("Errow while fetching players data", err)
	}

	var parsedResults = make(map[string]interface{})
	for _, data := range playerResults {
		val := data.Val()
		parsedResults[val["identifier"]] = val
	}

	return parsedResults
}

// This function stops the game timer
func (r *Room) finishGame() {
	if r.gameStarted || r.waitCountdownStarted || r.countdownStarted {
		r.ticker.Stop()

		for identifier := range r.Players {
			r.RemovePlayer(identifier);
		}
	}
}

func (r *Room) resetRoom() {
	if r.waitCountdownStarted || r.countdownStarted || r.gameStarted {
		r.ticker.Stop();
		db.Redis.HDel("rooms:"+r.Id, "text");
	}
}

// Receives the player score and updates the redis database
func (r *Room) handlePlayerUpdate(identifier string, score float64) {
	if r.gameStarted {
		db.Redis.HSet("rooms:"+r.Id+":players:"+identifier, "score", score)
	}
}

// Handles the player finishing the game: sets the finished flag, sends a message
func (r *Room) handlePlayerCompleted(identifier string, mistakes map[string]int) {

	if r.gameStarted {
		db.Redis.HSet("rooms:"+r.Id+":players:"+identifier, "completed", true)

		text := db.Redis.HGet("rooms:"+r.Id, "text")

		playerTime := int(r.time)

		// Calculate WPM and accuracy
		wpm, accuracy := manager.Game.CalculateResult(playerTime, len(mistakes), text.Val());

		r.SendMessage(
			TYPE_PLAYER_COMPLETED_GAME,
			map[string]interface{}{
				"identifier": identifier,
				"place":      r.nextPlace,
				"wpm":        wpm,
				"accuracy":   accuracy,
				"time": playerTime,
			},
		)

		logs.Success(
			"Player completes game",
			"Player "+identifier+"completes the game in room "+r.Id+" and finishes on "+strconv.Itoa(int(r.nextPlace))+" place. WPM: "+strconv.Itoa(wpm)+", Accuracy: "+strconv.Itoa(accuracy)+", Time: " + strconv.Itoa(playerTime),
			[]string{"websocket", "game", "players"},
			"Game Session "+r.Id,
		)

		if user, ok := manager.User.FindUserBy("username", identifier); ok {
			result, err := manager.Game.SaveResult(&user, r.Id, mistakes, wpm, accuracy, int(r.time), int(r.nextPlace))
			if err != nil {
				logs.Error("Error while saving a result", "An error occurred while saving results for user " + identifier, []string{"errors", "websocket", "game"}, "Game Session " + r.Id)
			}
			topchart.CheckTopChart(&result)
		}

		// Increment next place
		r.nextPlace++
	}
}

func (r *Room) haveAllPlayersCompletedGame() bool {
	// Check if all players have finished
	pipeline := db.Redis.Pipeline()
	defer pipeline.Close()

	var parsedResults = make(map[string]*redis.StringCmd)
	for identifier := range r.Players {
		parsedResults[identifier] = pipeline.HGet("rooms:"+r.Id+":players:"+identifier, "completed");
	}

	_, err := pipeline.Exec()
	if err != nil {
		log.Println("Errow while fetching players data", err)
	}

	for _, data := range parsedResults {
		if data.Val() == "0" {
			return false;
		}
	}

	return true;
}
