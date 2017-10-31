package controller

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/iKonrad/typitap/server/entities"
	"github.com/iKonrad/typitap/server/services/feed"
	"github.com/iKonrad/typitap/server/services/game"
	"github.com/iKonrad/typitap/server/services/graphics"
	"github.com/iKonrad/typitap/server/services/levels"
	"github.com/iKonrad/typitap/server/services/stats"
	"github.com/iKonrad/typitap/server/services/topchart"
	us "github.com/iKonrad/typitap/server/services/user"
	"github.com/iKonrad/typitap/server/services/utils"
	"github.com/labstack/echo"
	"github.com/iKonrad/typitap/server/services/gametexts"
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
	language := "EN"
	session, ok := game.FindOpenSession(isOnline, language)
	// Create the session and return it
	var err error
	if !ok {
		session, err = game.CreateSession(isOnline, language)
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

	var mistakes map[string]int
	if c.FormValue("mistakes") != "" {
		json.Unmarshal([]byte(c.FormValue("mistakes")), &mistakes)
	}

	// Get session to calculate game score
	session, err := game.GetSession(c.FormValue("sessionId"))

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"error":   "Could not save the session data",
		})
	}

	gameTime, _ := strconv.Atoi(c.FormValue("time"))

	wpm, accuracy := game.CalculateScore(gameTime, len(mistakes), session.Text.Text)

	var resultId string
	points := 0

	/*
		If game is completed by a guest, submit the result to a seaprate table.
		Otherwise, submit the result and calculate points, check trophies etc.
	*/
	if !c.Get("IsLoggedIn").(bool) {

		country, _ := us.GetCountryCodeByIP(utils.GetIPAdress(c.Request()))
		newResult, ok := game.SaveGuestResult(c.FormValue("user"), session.Id, mistakes, wpm, accuracy, gameTime, 0, utils.GetIPAdress(c.Request()), country)
		if ok {
			resultId = newResult["id"].(string)
			feed.SendGlobalActivity(feed.Activities.GuestCompletedGameActivity(wpm))
		} else {
			return c.JSON(http.StatusInternalServerError, map[string]interface{}{
				"success": false,
				"error":   "Could not save the session data",
			})
		}

	} else {

		user := c.Get("User").(entities.User)
		newResult, err := game.SaveResult(&user, c.FormValue("sessionId"), mistakes, wpm, int(accuracy), gameTime, 0, utils.GetIPAdress(c.Request()))

		if err != nil {
			log.Println(err)
			return c.JSON(http.StatusInternalServerError, map[string]interface{}{
				"success": false,
				"error":   "Could not save the session data",
			})
		}

		var playback []map[string]interface{}
		if c.FormValue("playback") != "" {
			json.Unmarshal([]byte(c.FormValue("playback")), &playback)
		}

		// Save result to the database
		game.SavePlayback(newResult.Id, playback)

		// Check if user made it to the top chart
		madeToChart := topchart.CheckTopChart(&newResult)

		if madeToChart {
			feed.SendActivityToUserAndFollowers(user.Id, feed.Activities.PlayerMakesToTopChart(user.Username, wpm))
			feed.SendGlobalActivity(feed.Activities.PlayerMakesToTopChart(user.Username, wpm))
		} else {
			feed.SendActivityToUserAndFollowers(user.Id, feed.Activities.PlayerCompletedOfflineGameActivity(user.Username, wpm))
			feed.SendGlobalActivity(feed.Activities.PlayerCompletedOfflineGameActivity(user.Username, wpm))
		}

		// Calculate experience points for a game result
		points = levels.CalculatePoints(&newResult, 0)

		// Apply points to user
		if points > 0 {
			levels.ApplyPoints(&user, points)
		}

		stats.IncrementGamesStat(user.Id)
	}

	game.MarkSessionFinished(c.FormValue("sessionId"))

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
		"resultId": resultId,
		"data": map[string]interface{}{
			"points":   points,
			"wpm":      wpm,
			"accuracy": accuracy,
		},
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

func (gc *GameAPIController) FetchResultboard(c echo.Context) error {
	resultId := c.Param("id")
	filePath := "static/images/resultboards/" + resultId + ".png"

	// Get file stats
	_, err := utils.GetFileCreated(filePath)
	if err == nil {
		return c.File(filePath)
	}

	result, ok := game.GetResultData(resultId)

	if !ok {
		return c.File("static/images/identity/typitap-logo.png") // @TODO: Replace these with actual default image
	}

	graphics.GenerateResultboard(result)
	return c.File(filePath)
}


func (gc *GameAPIController) GetLanguages(c echo.Context) error {
	languages := gametexts.GetTextLanguages()

	return c.JSON(http.StatusOK, map[string]interface{}{
		 "success": true,
		 "data": languages,
	})
}