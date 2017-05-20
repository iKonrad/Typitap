package controller

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/iKonrad/typitap/server/entities"
	"github.com/iKonrad/typitap/server/services/feed"
	"github.com/iKonrad/typitap/server/services/game"
	"github.com/iKonrad/typitap/server/services/topchart"
	"github.com/labstack/echo"
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
		game.DeleteOldSessionsForUser(user.Id)
	}

	isOnline := sessionType == "online"
	session, ok := game.FindOpenSession(isOnline)
	// Create the session and return it
	var err error
	if !ok {
		session, err = game.CreateSession(isOnline)
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

	var mistakes map[string]int
	if c.FormValue("mistakes") != "" {
		json.Unmarshal([]byte(c.FormValue("mistakes")), &mistakes)
	}

	wpm, _ := strconv.Atoi(c.FormValue("wpm"))
	accuracy, _ := strconv.ParseFloat(c.FormValue("accuracy"), 32)
	gameTime, _ := strconv.Atoi(c.FormValue("time"))

	log.Println("Acc", accuracy);
	newResult, err := game.SaveResult(&user, c.FormValue("sessionId"), mistakes, wpm, int(accuracy), gameTime, 0)

	feed.SendActivity(user.Id, feed.Activities.PlayerCompletedOfflineGameActivity(user.Username, wpm))

	game.MarkSessionFinished(c.FormValue("sessionId"))

	// Submit the result for the top chart
	if err != nil {

		log.Println(err)
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"error":   "Could not save the session data",
		})
	}

	topchart.CheckTopChart(&newResult)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success":  true,
		"resultId": newResult.Id,
	})

}

func (ac *GameAPIController) GetChartsData(c echo.Context) error {

	charts := topchart.GetCharts()
	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    charts,
	})
}

func (ac *GameAPIController) GetChartData(c echo.Context) error {

	name := c.Param("name")
	chart := topchart.GetChart(name)
	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    chart,
	})
}
