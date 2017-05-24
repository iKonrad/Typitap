package controller

import (
	"net/http"
	"strconv"

	"github.com/iKonrad/typitap/server/entities"
	"github.com/iKonrad/typitap/server/services/feed"
	"github.com/iKonrad/typitap/server/services/stats"
	us "github.com/iKonrad/typitap/server/services/user"
	"github.com/labstack/echo"
)

type UserAPIController struct {
}

var UserAPI UserAPIController

func init() {
	UserAPI = UserAPIController{}
}

func (gc UserAPIController) GetUserGameResults(c echo.Context) error {


	user := c.Get("User").(entities.User)

	filters := map[string]interface{}{}

	filters["userId"] = user.Id

	if c.QueryParam("online") != "" {
		filters["online"] = true
	}

	if c.QueryParam("finished") != "" {
		filters["finished"] = true
	}

	o := c.QueryParam("offset")
	if o == "" {
		o = "0"
	}

	offset, _ := strconv.Atoi(o)

	results, ok := us.GetGameResultsForUser(offset, filters)

	if !ok {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"error":   "Internal error occurred",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    results,
	})
}

func (gc UserAPIController) UpdateAccountInformation(c echo.Context) error {


	field := c.FormValue("field")
	value := c.FormValue("value")
	user := c.Get("User").(entities.User)

	switch field {
	case "Name":
		isValid, err := us.ValidateName(value)
		if isValid {
			user.Name = value
		} else {
			return c.JSON(http.StatusOK, map[string]interface{}{
				"success": false,
				"message": err,
			})
		}
	case "Email":
		isValid, err := us.ValidateEmail(value)
		if isValid {
			user.Email = value
		} else {
			return c.JSON(http.StatusOK, map[string]interface{}{
				"success": false,
				"message": err,
			})
		}

	case "Password":

		isValid, err := us.ValidatePassword(value)
		if isValid {
			us.UpdateUserPassword(value, user)
			return c.JSON(http.StatusOK, map[string]interface{}{
				"success": true,
				"message": "Password updated",
			})
		}
		return c.JSON(http.StatusOK, map[string]interface{}{
			"success": false,
			"message": err,
		})
	}

	if ok := us.UpdateUser(&user); ok {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"success": true,
			"message": "Account updated",
		})
	} else {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"message": "Something went wrong. Try again.",
		})
	}

}

func (gc UserAPIController) GetUserActivityFeed(c echo.Context) error {


	o := c.QueryParam("offset")
	if o == "" {
		o = "0"
	}

	offset, _ := strconv.Atoi(o)

	user := c.Get("User").(entities.User)

	if userFeed, ok := feed.GetFeedForUser(user.Id, offset); ok {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"success": true,
			"data":    userFeed,
		})
	}

	return c.JSON(http.StatusNoContent, map[string]interface{}{
		"success": false,
	})

}

func (gc UserAPIController) GetUserStats(c echo.Context) error {

	// Check if user is logged in
	if !c.Get("IsLoggedIn").(bool) {
		return c.JSON(http.StatusMethodNotAllowed, map[string]interface{}{
			"success": false,
		})
	}

	user := c.Get("User").(entities.User)

	if userStats, ok := stats.GetStatsForUser(user.Id); ok {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"success": true,
			"data":    userStats,
		})
	}

	return c.JSON(http.StatusNoContent, map[string]interface{}{
		"success": false,
		"message": "No stats for this user",
	})
}

func (gc UserAPIController) FollowUser(c echo.Context) error {

	user := c.Get("User").(entities.User)
	followingUser := c.Param("followUser")
	userExists := us.UserExists(followingUser)

	if !userExists {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"success":  false,
			"message": "User doesn't exist",
		})
	}

	feed.FollowUser(user.Id, followingUser)
	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
	})
}

func (gc UserAPIController) UnfollowUser(c echo.Context) error {


	user := c.Get("User").(entities.User)
	followingUser := c.Param("followUser")
	userExists := us.UserExists(followingUser)

	if !userExists {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"success":  false,
			"message": "User doesn't exist",
		})
	}

	feed.UnfollowUser(user.Id, followingUser)
	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
	})
}

func (gc UserAPIController) GetUserProfileData(c echo.Context) error {

	username := c.Param("user")

	user, ok := us.FindUserBy("username", username)

	if !ok {
		return c.JSON(http.StatusNoContent, map[string]interface{}{
			"success": false,
		})
	}

	user.Password = ""

	// Get stats for user
	userStats, ok := stats.GetStatsForUser(user.Id)
	filters := map[string]interface{}{}
	o := c.QueryParam("offset")
	if o == "" {
		o = "0"
	}

	offset, _ := strconv.Atoi(o)
	filters["userId"] = user.Id
	recentGames, _ := us.GetGameResultsForUser(offset, filters)

	follow, _ := feed.GetFollowForUser(user.Id)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"user":  user,
			"stats": userStats,
			"games": recentGames,
			"follow": follow,
		},
	})
}


func (gc UserAPIController) GetUserFollow(c echo.Context) error {

	// Check if user is logged in
	if !c.Get("IsLoggedIn").(bool) {
		return c.JSON(http.StatusMethodNotAllowed, map[string]interface{}{
			"success": false,
		})
	}

	user := c.Get("User").(entities.User)

	follow, _ := feed.GetFollowForUser(user.Id)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
		"data": follow,
	})

}