package controller

import (
	"log"
	"net/http"

	"github.com/iKonrad/typitap/server/entities"
	"github.com/iKonrad/typitap/server/manager"
	"github.com/labstack/echo"
	"strconv"
	"encoding/json"
)

type GameAPIController struct {
}

var GameAPI GameAPIController

func init() {
	GameAPI = GameAPIController{}
}

func (ac *GameAPIController) GetSession(c echo.Context) error {

	sessionType := c.Param("type")

	var user entities.User
	// Check if user is logged in
	if c.Get("IsLoggedIn").(bool) {
		// If logged in, check if there's already an open offline session, and delete it
		user = c.Get("User").(entities.User)
		manager.Game.DeleteOldSessionsForUser(user.Id)
	}

	isOnline := sessionType == "online"
	session, ok := manager.Game.FindOpenSession(isOnline)
	// Create the session and return it
	var err error
	if !ok {
		session, err = manager.Game.CreateSession(isOnline)
	}

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"message": "Error while creating a session",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success":   true,
		"sessionId": session.Id,
		"text":      session.Text.Text,
	})

}

func (ac *GameAPIController) SaveResult(c echo.Context) error {

	if !c.Get("IsLoggedIn").(bool) {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"success": false,
		})
	}

	user := c.Get("User").(entities.User)

	data := map[string]interface{}{
		"time":      c.FormValue("time"),
		"wpm":       c.FormValue("wpm"),
		"accuracy":  c.FormValue("accuracy"),
		"mistakes":  c.FormValue("mistakes"),
		"sessionId": c.FormValue("sessionId"),
		"user":      user,
	}

	var mistakes map[string]int
	if c.FormValue("mistakes") != "" {
		json.Unmarshal([]byte(data["mistakes"].(string)), &mistakes)
	}

	wpm, _ := strconv.Atoi(c.FormValue("wpm"))
	accuracy, _ := strconv.Atoi(c.FormValue("accuracy"))
	gameTime, _ := strconv.Atoi(c.FormValue("time"))

	newResult, err := manager.Game.SaveResult(&user, c.FormValue("sessionId"), mistakes, wpm, accuracy, gameTime, 0)

	if err != nil {
		log.Println(err)
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"error":   "Couldn not save the session data",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success":  true,
		"resultId": newResult.Id,
	})

}
