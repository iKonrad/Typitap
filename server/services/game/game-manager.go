package game

import (
	"errors"
	"log"
	"time"

	"github.com/iKonrad/typitap/server/entities"
	db "github.com/iKonrad/typitap/server/services/database"
	"github.com/iKonrad/typitap/server/services/utils"
	"github.com/satori/go.uuid"
	r "gopkg.in/gorethink/gorethink.v3"
)

func CreateSession(online bool) (entities.GameSession, error) {

	// Get random text from the database
	gameText, err := getRandomGameText()
	if err != nil {
		log.Println("No text found" + err.Error())
		return entities.GameSession{}, err
	}

	sessionId := uuid.NewV4()

	// Create session object
	gameSession := entities.GameSession{
		Id:      sessionId.String(),
		Created: time.Now(),
		Online:  online,
		Open:    true,
		Text:    gameText,
	}

	// Save object in the database
	r.Table("game_sessions").Insert(gameSession).Exec(db.Session)
	return gameSession, nil

}

func GetSession(sessionId string) (entities.GameSession, error) {

	// Fetch the game text
	resp, err := r.Table("game_sessions").Get(sessionId).Merge(func(p r.Term) interface{} {
		return map[string]interface{}{
			"textId": r.Table("game_texts").Get(p.Field("textId")),
		}
	}).Run(db.Session)
	defer resp.Close()
	if err != nil {
		log.Println("No Session found for ID" + err.Error())
		return entities.GameSession{}, errors.New("An error occurred while fetching the game session")
	}

	var gameSession entities.GameSession
	err = resp.One(&gameSession)
	if err != nil {
		log.Println("Error while fetching the game session: " + err.Error())
		return entities.GameSession{}, errors.New("An error occurred while fetching the game session")
	}

	return gameSession, nil

}

// Fetches the open session from database if exists
func FindOpenSession(online bool) (entities.GameSession, bool) {

	// Fetch the game text
	resp, err := r.Table("game_sessions").Filter(map[string]interface{}{
		"online":   online,
		"open":     true,
		"finished": false,
	}).OrderBy(r.Asc("created")).Merge(func(p r.Term) interface{} {
		return map[string]interface{}{
			"textId": r.Table("game_texts").Get(p.Field("textId")),
		}
	}).Run(db.Session)

	if err != nil {
		return entities.GameSession{}, false
	}

	var session entities.GameSession

	// check if session exists
	if !resp.IsNil() {
		resp.One(&session)
	} else {
		return entities.GameSession{}, false
	}

	if err != nil || session.Id == "" {
		return entities.GameSession{}, false
	}

	return session, true
}

func CloseGameSession(sessionId string) {

	r.Table("game_sessions").Get(sessionId).Update(map[string]interface{}{
		"open": false,
	}).Exec(db.Session)
}

func OpenGameSession(sessionId string) {

	r.Table("game_sessions").Get(sessionId).Update(map[string]interface{}{
		"open": true,
	}).Exec(db.Session)
}

func getRandomGameText() (entities.GameText, error) {

	resp, err := r.Table("game_texts").Sample(1).Run(db.Session)
	defer resp.Close()
	if err != nil {
		log.Println("No text found" + err.Error())
		return entities.GameText{}, errors.New("An error occurred while fetching the game text")
	}

	var gameText entities.GameText
	err = resp.One(&gameText)

	if err != nil {
		log.Println("Error while fetching the game text: " + err.Error())
		return entities.GameText{}, errors.New("An error occurred while fetching the game text")
	}

	return gameText, nil

}

func getGameText(textId int) (entities.GameText, error) {

	// Fetch the game text
	resp, err := r.Table("game_texts").Get(textId).Run(db.Session)
	defer resp.Close()
	if err != nil {
		log.Println("No Text found for ID" + err.Error())
		return entities.GameText{}, errors.New("An error occurred while fetching the game text")
	}

	var gameText entities.GameText
	err = resp.One(&gameText)
	if err != nil {
		log.Println("Error while fetching the game text: " + err.Error())
		return entities.GameText{}, errors.New("An error occurred while fetching the game text")
	}

	return gameText, nil

}

func SaveResult(user *entities.User, sessionId string, mistakes map[string]int, wpm int, accuracy int, gameTime int, place int) (entities.GameResult, error) {

	// Get Session by ID
	session, err := GetSession(sessionId)
	if err != nil {
		return entities.GameResult{}, err
	}

	newId := uuid.NewV4()

	// Create result object
	newResult := entities.GameResult{
		Id:       newId.String(),
		User:     *user,
		Created:  time.Now(),
		WPM:      wpm,
		Accuracy: accuracy,
		Time:     gameTime,
		Mistakes: mistakes,
		Session:  session,
		Place:    place,
	}

	// Save the result in the database

	r.Table("game_results").Insert(newResult).Exec(db.Session)
	return newResult, nil

}

func validateGameResult(details map[string]interface{}) (map[string]string, bool) {

	errors := map[string]string{}
	isValid := true
	if _, ok := details["time"].(string); !ok {
		errors["time"] = "Invalid time"
		isValid = false
	}

	if _, ok := details["wpm"].(string); !ok {
		errors["wpm"] = "Invalid wpm"
		isValid = false
	}

	if _, ok := details["accuracy"].(string); !ok {
		errors["accuracy"] = "Invalid accuracy"
		isValid = false
	}

	return errors, isValid

}

func MarkSessionFinished(sessionId string) {

	r.Table("game_sessions").Get(sessionId).Update(map[string]interface{}{
		"finished": true,
		"open":     false,
	}).Exec(db.Session)
}

func DeleteOldSessionsForUser(userId string) {

	r.Table("game_sessions").Filter(map[string]interface{}{
		"finished": false,
		"userId":   userId,
		"online":   false,
	}).Delete().Exec(db.Session)
}

func CalculateScore(time int, errors int, text string) (int, int) {

	// Get count of virtual, 5 characters words
	virtualWords := utils.WordsCount(text)

	// Calculate the WPM
	speed := int(float64(virtualWords) * (60.0 / float64(time)))

	// Calculate the accuracy
	accuracy := 100 - int((float64(errors)/float64(virtualWords))*100)

	return speed, accuracy
}

func GetResultData(id string) (entities.GameResult, bool) {

	resp, err := r.Table("game_results").Get(id).Without("userId").Merge(func(p r.Term) interface{} {
		return map[string]interface{}{
			"sessionId": r.Table("game_sessions").Get(p.Field("sessionId")).
				Merge(func(s r.Term) interface{} {
					return map[string]interface{}{
						"textId": r.Table("game_texts").Get(s.Field("textId")),
					}
				}),
		}
	}).Run(db.Session)

	if err != nil {
		log.Println("ERR", err)
		return entities.GameResult{}, false
	}

	var result entities.GameResult
	err = resp.One(&result)

	if err != nil {
		log.Println("ERR2", err)
		return entities.GameResult{}, false
	}

	return result, true

}

func SavePlayback(id string, playback []map[string]interface{}) {

	r.Table("game_playbacks").Insert(map[string]interface{}{
		"id":       id,
		"playback": playback,
	}).RunWrite(db.Session)

}

func GetPlayback(id string) (map[string]interface{}, bool) {

	resp, err := r.Table("game_playbacks").Get(id).Run(db.Session)

	if err != nil || resp.IsNil() {
		return map[string]interface{}{}, false
	}

	var playback map[string]interface{}
	err = resp.One(&playback)

	return playback, true

}
