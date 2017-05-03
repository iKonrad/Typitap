package manager;

import (
	"errors"
	"github.com/iKonrad/typitap/server/entities"
	r "gopkg.in/gorethink/gorethink.v3"
	db "github.com/iKonrad/typitap/server/database"
	"log"
	"github.com/satori/go.uuid"
	"time"
	"encoding/json"
	"strconv"
)

type GameManager struct {
}

var Game GameManager;

func init() {
	Game = GameManager{};
}


func (gm GameManager) CreateSession(online bool, user *entities.User) (entities.GameSession, error) {

	// Get random text from the database
	gameText, err := gm.getRandomGameText();

	if err != nil {
		log.Println("No text found" + err.Error())
		return entities.GameSession{}, err
	}

	sessionId := uuid.NewV4();

	// Create session object
	gameSession := entities.GameSession{
		Id: sessionId.String(),
		Created: time.Now(),
		Online: online,
		Open: true,
		Text: gameText,
	};

	if user != nil && user.Id != "" {
		gameSession.Users = []entities.User{*user};
	}

	// Save object in the database
	r.Table("game_sessions").Insert(gameSession).Exec(db.Session);

	return gameSession, nil

}

func (gm GameManager) getRandomGameText() (entities.GameText, error) {

	resp, err := r.Table("game_texts").Sample(1).Run(db.Session)
	defer resp.Close();

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
	resp, err := r.Table("game_texts").Get(textId).Run(db.Session);
	defer resp.Close();

	if err != nil {
		log.Println("No Text found for ID" + err.Error());
		return entities.GameText{}, errors.New("An error occurred while fetching the game text");
	}

	var gameText entities.GameText;
	err = resp.One(&gameText);

	if err != nil {
		log.Println("Error while fetching the game text: " + err.Error());
		return entities.GameText{}, errors.New("An error occurred while fetching the game text");
	}

	return gameText, nil

}

func (gm GameManager) SaveResult(user *entities.User, data map[string]interface{}) (entities.GameResult, error) {

	_, isValid := gm.validateGameResult(data);
	if !isValid {
		return entities.GameResult{}, errors.New("Problem with saving game results");
	}

	var mistakes map[string]int;

	if data["mistakes"] != nil {
		json.Unmarshal([]byte(data["mistakes"].(string)),  &mistakes);
	}

	// Get Session by ID
	session, err := gm.GetSession(data["sessionId"].(string));

	if err != nil {
		return entities.GameResult{}, err
	}


	newId := uuid.NewV4();
	gameWpm, _ := strconv.Atoi(data["wpm"].(string));
	gameAccuracy, _ := strconv.Atoi(data["accuracy"].(string));
	gameTime, _ := strconv.Atoi(data["time"].(string));

	// @TODO: Calculate WPM on server

	// Create result object
	newResult := entities.GameResult{
		Id: newId.String(),
		User: *user,
		Created: time.Now(),
		WPM: gameWpm,
		Accuracy: gameAccuracy,
		Time: gameTime,
		Mistakes: mistakes,
		Session: session,
	};

	// Save the result in the database

	r.Table("game_results").Insert(newResult).Exec(db.Session);

	return newResult, nil

};

func (gm GameManager) validateGameResult(details map[string]interface{}) (map[string]string, bool) {

	errors := map[string]string{};
	isValid := true;
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
	}).Exec(db.Session);

}

func (gm GameManager) DeleteOldSessionsForUser(userId string) {

	r.Table("game_sessions").Filter(map[string]interface{}{
		"finished": false,
		"userId": userId,
		"online": false,
	}).Delete().Exec(db.Session);

}


func (gm GameManager) GetSession(sessionId string) (entities.GameSession, error) {

	// Fetch the game text
	resp, err := r.Table("game_sessions").Get(sessionId).Merge(func (p r.Term) interface{} {
		return map[string]interface{} {
			"textId": r.Table("game_texts").Get(p.Field("textId")),
			"userIds": r.Table("users").GetAll(r.Args(p.Field("userIds"))).CoerceTo("array"),
		}
	}).Run(db.Session);

	defer resp.Close();


	if err != nil {
		log.Println("No Session found for ID" + err.Error());
		return entities.GameSession{}, errors.New("An error occurred while fetching the game session");
	}

	var gameSession entities.GameSession;
	err = resp.One(&gameSession);

	if err != nil {
		log.Println("Error while fetching the game session: " + err.Error());
		return entities.GameSession{}, errors.New("An error occurred while fetching the game session");
	}

	return gameSession, nil

}

// Fetches the open session from database if exists
func (gm GameManager) FindOpenSession(online bool, user *entities.User) (entities.GameSession, bool) {

	// Fetch the game text
	resp, err := r.Table("game_sessions").Filter(map[string]interface{}{
		"online": online,
		"open": true,
	}).Merge(func (p r.Term) interface{} {
		return map[string]interface{} {
			"textId": r.Table("game_texts").Get(p.Field("textId")),
			"userIds": r.Table("users").GetAll(r.Args(p.Field("userIds"))).CoerceTo("array"),
		}
	}).Run(db.Session)

	if err != nil {
		return entities.GameSession{}, false
	}

	var session entities.GameSession

	// check if session exists
	if !resp.IsNil() {
		resp.One(&session)
		// Assign the user to the session if exists
		if user != nil && user.Id != "" {
			session.Users = append(session.Users, *user);
			r.Table("game_sessions").Get(session.Id).Update(session).Exec(db.Session);
		}

		// Session returned
		return session, true
	}

	if err != nil {
		return entities.GameSession{}, false;
	}

	return session, true;

}

