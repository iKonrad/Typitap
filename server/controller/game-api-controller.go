package controller

import (
	"github.com/iKonrad/typitap/server/entities"
	"github.com/iKonrad/typitap/server/manager"
	"github.com/labstack/echo"
	"net/http"
	"log"
)

type GameAPIController struct {
}

var GameAPI GameAPIController

func init() {
	GameAPI = GameAPIController{}
}



func (ac *GameAPIController) JoinOffline(c echo.Context) error {

	var user entities.User;
	// Check if user is logged in
	if c.Get("IsLoggedIn").(bool) {
		// If logged in, check if there's already an open offline session, and delete it
		user = c.Get("User").(entities.User);
		manager.Game.DeleteOldSessionsForUser(user.Id);
	}

	// Create the session and return it
	newSession, err := manager.Game.CreateOfflineSession(&user);

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"message": "Error while creating a session",
		});
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
		"sessionId": newSession.Id,
		"text": newSession.Text.Text,
	});

}


func (ac *GameAPIController) SaveResult(c echo.Context) error {

	if !c.Get("IsLoggedIn").(bool) {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"success": false,
		});
	}


	user := c.Get("User").(entities.User);

	data := map[string]interface{}{
		"time": c.FormValue("time"),
		"wpm": c.FormValue("wpm"),
		"accuracy": c.FormValue("accuracy"),
		"mistakes": c.FormValue("mistakes"),
		"sessionId": c.FormValue("sessionId"),
		"user": user,
	};


	newResult, err := manager.Game.SaveResult(&user, data);

	if err != nil {
		log.Println(err);
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"error": "Couldn not save the session data",
		});
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
		"resultId": newResult.Id,
	});

}