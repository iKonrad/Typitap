package controller

import (
	"net/http"
	"strconv"

	"github.com/iKonrad/typitap/server/entities"
	"github.com/iKonrad/typitap/server/services/feed"
	"github.com/iKonrad/typitap/server/services/levels"
	"github.com/iKonrad/typitap/server/services/mail"
	"github.com/iKonrad/typitap/server/services/stats"
	us "github.com/iKonrad/typitap/server/services/user"
	"github.com/labstack/echo"
	"github.com/iKonrad/typitap/server/services/userboard"
	"github.com/iKonrad/typitap/server/services/utils"
	"time"
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
			"message": "Internal error occurred",
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

			us.RemoveTokensForUser(us.TOKEN_CHANGE_EMAIL, user.Id)
			token, ok := us.GenerateUserToken(us.TOKEN_CHANGE_EMAIL, user, value)

			if !ok {
				return c.JSON(http.StatusInternalServerError, map[string]interface{}{
					"success": false,
					"message": "Could not generate a token",
				})
			}

			// Send an e-mail change link
			link := "http://" + c.Request().Host + "/auth/email/" + token
			mail.SendEmail(value, mail.TEMPLATE_CHANGE_EMAIL, mail.TemplateButtonLink(
				user.Name,
				user.Username,
				link,
			))

			return c.JSON(http.StatusOK, map[string]interface{}{
				"success": true,
				"message": "We've sent you a confirmation link on your new e-mail address.",
			})
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
	case "Keyboard":
		if value == "" {
			return c.JSON(http.StatusOK, map[string]interface{}{
				"success": false,
				"message": "This field cannot be empty",
			})
		}
		user.Keyboard = value
	case "KeyboardLayout":
		if value == "" {
			return c.JSON(http.StatusOK, map[string]interface{}{
				"success": false,
				"message": "This field cannot be empty",
			})
		}
		layoutId, _ := strconv.Atoi(value)
		user.KeyboardLayout = layoutId
	case "Bio":
		if value == "" {
			return c.JSON(http.StatusOK, map[string]interface{}{
				"success": false,
				"message": "This field cannot be empty",
			})
		}
		user.Bio = value
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
	followingUserId := c.Param("followUser")

	followingUser, ok := us.GetUser(followingUserId)
	if !ok {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"success": false,
			"message": "User doesn't exist",
		})
	}

	feed.FollowUser(user.Id, followingUser.Id)

	feed.SendActivityToFollowers(user.Id, feed.Activities.UserFollows(user.Username, followingUser.Username))

	feed.SendActivity(followingUser.Id, feed.Activities.UserFollowsYou(user.Username))

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
			"success": false,
			"message": "User doesn't exist",
		})
	}

	feed.UnfollowUser(user.Id, followingUser)
	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
	})
}

// Retrieves user's profile data
func (gc UserAPIController) GetUserProfileData(c echo.Context) error {

	username := c.Param("user")

	u, ok := us.FindUserBy("username", username)

	// Convert User struct into map

	user := us.ConvertUserToMap(&u)
	if !ok {
		return c.JSON(http.StatusNoContent, map[string]interface{}{
			"success": false,
		})
	}

	delete(user, user["Password"].(string))
	user["LevelName"] = levels.GetLevelName(int(user["Level"].(float64)))

	// Get stats for user
	userStats, ok := stats.GetStatsForUser(user["Id"].(string))
	filters := map[string]interface{}{}
	o := c.QueryParam("offset")
	if o == "" {
		o = "0"
	}

	offset, _ := strconv.Atoi(o)
	filters["userId"] = user["Id"].(string)
	recentGames, _ := us.GetGameResultsForUser(offset, filters)

	follow, _ := feed.GetUserFollow(user["Id"].(string))

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"user":   user,
			"stats":  userStats,
			"games":  recentGames,
			"follow": follow,
		},
	})
}

// Retrieves user followers and following users
func (gc UserAPIController) GetUserFollow(c echo.Context) error {

	// Check if user is logged in
	if !c.Get("IsLoggedIn").(bool) {
		return c.JSON(http.StatusMethodNotAllowed, map[string]interface{}{
			"success": false,
		})
	}

	user := c.Get("User").(entities.User)

	follow, _ := feed.GetUserFollow(user.Id)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    follow,
	})

}

// Crates an activate token and sends an e-mail with a link to confirm users account
func (gc UserAPIController) ResendActivationLink(c echo.Context) error {

	user := c.Get("User").(entities.User)

	if user.Active {
		return c.JSON(http.StatusPartialContent, map[string]interface{}{
			"success": false,
			"message": "Your account is already active. Try refreshing the page",
		})
	}

	us.RemoveTokensForUser("activate", user.Id)
	token, ok := us.GenerateUserToken("activate", user, "")

	if !ok {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"message": "Could not generate a token",
		})
	}

	// Send confirmation e-mail with an activation link
	link := "http://" + c.Request().Host + "/auth/activate/" + token
	mail.SendEmail(user.Email, mail.TEMPLATE_NEW_ACCOUNT, mail.TemplateButtonLink(
		user.Name,
		user.Username,
		link,
	))

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
		"message": "E-mail sent",
	})

}


func (gc UserAPIController) FetchUserBoard(c echo.Context) error {

	id := c.Param("id");
	filePath := "static/images/userboards/" + id + ".png";

	// Get file stats
	_, creationTime, _, err := utils.StatTimes(filePath)
	if err == nil {
		// If file was generated within the last 24 hours, return the file to avoid unnecessary overload on the server. Otherwise, recalculate the stats
		duration := time.Since(creationTime)
		if duration.Hours() < 24 {
			return c.File(filePath)
		}

	}

	// Get user object so we can fetch the stats and username
	userObject, ok := us.GetUser(id);
	if !ok {
		return c.File("static/images/identity/typitap-logo.png") // @TODO: Replace these with actual default image
	}

	// Get user stats and pass it on to the userboard generator
	userStats, ok := stats.GetStatsForUser(userObject.Id)
	if !ok {
		return c.File("static/images/identity/typitap-logo.png") // @TODO: Replace these with actual default image
	}

	userboard.GenerateUserboard(userObject.Username, userObject.Id, userStats)
	return c.File(filePath)

}