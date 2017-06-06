package controller

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/iKonrad/typitap/server/entities"
	"github.com/iKonrad/typitap/server/services/feed"
	"github.com/iKonrad/typitap/server/services/game"
	"github.com/iKonrad/typitap/server/services/levels"
	"github.com/iKonrad/typitap/server/services/stats"
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

	user := c.Get("User").(entities.User)

	var mistakes map[string]int
	if c.FormValue("mistakes") != "" {
		json.Unmarshal([]byte(c.FormValue("mistakes")), &mistakes)
	}

	wpm, _ := strconv.Atoi(c.FormValue("wpm"))
	accuracy, _ := strconv.ParseFloat(c.FormValue("accuracy"), 32)
	gameTime, _ := strconv.Atoi(c.FormValue("time"))

	var playback []map[string]interface{}
	if c.FormValue("playback") != "" {
		json.Unmarshal([]byte(c.FormValue("playback")), &playback)
	}

	// Save result to the database
	newResult, err := game.SaveResult(&user, c.FormValue("sessionId"), mistakes, wpm, int(accuracy), gameTime, 0)
	game.SavePlayback(newResult.Id, playback)

	game.MarkSessionFinished(c.FormValue("sessionId"))

	// Check if user made it to the top chart
	madeToChart := topchart.CheckTopChart(&newResult)

	if madeToChart {
		feed.SendActivityToUserAndFollowers(user.Id, feed.Activities.PlayerMakesToTopChart(user.Username, wpm))
		feed.SendGlobalActivity(feed.Activities.PlayerMakesToTopChart(user.Username, wpm))
	} else {
		feed.SendActivityToUserAndFollowers(user.Id, feed.Activities.PlayerCompletedOfflineGameActivity(user.Username, wpm))
		feed.SendGlobalActivity(feed.Activities.PlayerCompletedOfflineGameActivity(user.Username, wpm))
	}

	stats.IncrementGamesStat(user.Id)

	// Calculate experience points for a game result
	points := levels.CalculatePoints(&newResult, 0)

	log.Println("Points", points)

	// Apply points to user
	if points > 0 {
		levels.ApplyPoints(&user, points)
	}

	// Submit the result for the top chart
	if err != nil {

		log.Println(err)
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"error":   "Could not save the session data",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success":  true,
		"resultId": newResult.Id,
		"points":   points,
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

func (gc *GameAPIController) GetGlobalFeed(c echo.Context) error {

	o := c.QueryParam("offset")
	if o == "" {
		o = "0"
	}

	offset, _ := strconv.Atoi(o)
	if appFeed, ok := feed.GetFeedForUser("global", offset); ok {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"success": true,
			"data":    appFeed,
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    []string{},
	})
}

func (gc *GameAPIController) GetResultsData(c echo.Context) error {

	resultId := c.Param("id")
	result, ok := game.GetResultData(resultId)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": ok,
		"data":    result,
	})
}

func (gc *GameAPIController) GetPlaybackData(c echo.Context) error {

	resultId := c.Param("id")

	playback, ok := game.GetPlayback(resultId)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": ok,
		"data":    playback,
	})

}
