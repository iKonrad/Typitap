package manager

import (
	"errors"
	"log"
	"strings"
	"time"

	db "github.com/iKonrad/typitap/server/database"
	"github.com/iKonrad/typitap/server/entities"
	"github.com/satori/go.uuid"
	r "gopkg.in/gorethink/gorethink.v3"
)

type GameManager struct {
}

var Game GameManager

func init() {
	Game = GameManager{}
}

func (gm GameManager) CreateSession(online bool) (entities.GameSession, error) {

	// Get random text from the database
	gameText, err := gm.getRandomGameText()
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

func (gm GameManager) GetSession(sessionId string) (entities.GameSession, error) {

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
func (gm GameManager) FindOpenSession(online bool) (entities.GameSession, bool) {

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

func (gm GameManager) CloseGameSession(sessionId string) {

	r.Table("game_sessions").Get(sessionId).Update(map[string]interface{}{
		"open": false,
	}).Exec(db.Session)
}

func (gm GameManager) OpenGameSession(sessionId string) {

	r.Table("game_sessions").Get(sessionId).Update(map[string]interface{}{
		"open": true,
	}).Exec(db.Session)
}

func (gm GameManager) getRandomGameText() (entities.GameText, error) {

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

func (gm GameManager) getGameText(textId int) (entities.GameText, error) {

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

func (gm GameManager) SaveResult(user *entities.User, sessionId string, mistakes map[string]int, wpm int, accuracy int, gameTime int, place int) (entities.GameResult, error) {

	// Get Session by ID
	session, err := gm.GetSession(sessionId)
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

func (gm GameManager) validateGameResult(details map[string]interface{}) (map[string]string, bool) {

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

func (gm GameManager) MarkSessionFinished(sessionId string) {

	r.Table("game_sessions").Get(sessionId).Update(map[string]interface{}{
		"finished": true,
		"open":     false,
	}).Exec(db.Session)
}

func (gm GameManager) DeleteOldSessionsForUser(userId string) {

	r.Table("game_sessions").Filter(map[string]interface{}{
		"finished": false,
		"userId":   userId,
		"online":   false,
	}).Delete().Exec(db.Session)
}

func (gm GameManager) CalculateResult(time int, errors int, text string) (int, int) {

	// Remove spaces form the text
	oneString := strings.Replace(text, " ", "", -1)

	// Count number of characters in a string
	characters := len([]rune(oneString))

	// Divide the text by 5 to get number of average words
	virtualWords := int(characters / 5)

	if characters%5 > 2 {
		virtualWords++
	}

	// Calculate the WPM
	speed := int(float64(virtualWords) * (60.0 / float64(time)))

	// Calculate the accuracy
	accuracy := 100 - int((float64(errors)/float64(virtualWords))*100)

	return speed, accuracy
}
