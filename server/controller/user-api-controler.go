package controller

import (
	"net/http"
	"strconv"

	"time"

	"github.com/iKonrad/typitap/server/entities"
	"github.com/iKonrad/typitap/server/services/comments"
	"github.com/iKonrad/typitap/server/services/feed"
	"github.com/iKonrad/typitap/server/services/graphics"
	"github.com/iKonrad/typitap/server/services/levels"
	"github.com/iKonrad/typitap/server/services/mail"
	"github.com/iKonrad/typitap/server/services/stats"
	us "github.com/iKonrad/typitap/server/services/user"
	"github.com/iKonrad/typitap/server/services/utils"
	"github.com/labstack/echo"
	"github.com/iKonrad/typitap/server/services/gametexts"
	"github.com/iKonrad/typitap/server/services/logs"
)

type UserAPIController struct {
}

var UserAPI UserAPIController

func init() {
	UserAPI = UserAPIController{}
}

func (uc UserAPIController) GetUserGameResults(c echo.Context) error {

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

func (uc UserAPIController) UpdateAccountInformation(c echo.Context) error {

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

			uc.updateForumUserAttribute(user.Username, "password", value)

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

		uc.updateForumUserAttribute(user.Username, "bio", value)

	case "Country":
		if value == "" {
			return c.JSON(http.StatusOK, map[string]interface{}{
				"success": false,
				"message": "This field cannot be empty",
			})
		}

		code, ok := us.ValidateCountryCode(value)

		if !ok {
			return c.JSON(http.StatusOK, map[string]interface{}{
				"success": false,
				"message": "Invalid country code",
			})
		}

		user.Country = code
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

func (uc UserAPIController) updateForumUserAttribute(username string, attribute string, value string) {
	forumUser, forumError := flarumClient.GetUserByUsername(username)
	forumUserData, ok := forumUser["data"].([]interface{})
	if forumError == nil && ok && len(forumUserData) > 0 {
		if forumUserId, ok := forumUserData[0].(map[string]interface{})["id"]; ok {
			flarumClient.UpdateUserAttribute(forumUserId.(string), attribute, value)
		}
	}
}

func (uc UserAPIController) GetUserActivityFeed(c echo.Context) error {

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

func (uc UserAPIController) GetUserStats(c echo.Context) error {

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

func (uc UserAPIController) FollowUser(c echo.Context) error {

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

func (uc UserAPIController) UnfollowUser(c echo.Context) error {

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
func (uc UserAPIController) GetUserProfileData(c echo.Context) error {

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
	user["NextExp"] = levels.CalculateThresholdForLevel(int(user["Level"].(float64)) + 1)

	userComments, ok := comments.GetComments(user["Id"].(string))

	// Get stats for user
	userStats, ok := stats.GetStatsForUser(user["Id"].(string))

	filters := map[string]interface{}{}
	o := c.QueryParam("offset")
	if o == "" {
		o = "0"
	}

	// Get chart data
	chartData, ok := stats.GetChartStatsForUser(user["Id"].(string))

	offset, _ := strconv.Atoi(o)
	filters["userId"] = user["Id"].(string)
	recentGames, _ := us.GetGameResultsForUser(offset, filters)

	follow, _ := feed.GetUserFollow(user["Id"].(string))

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
		"data": map[string]interface{}{
			"user":     user,
			"stats":    userStats,
			"charts":   chartData,
			"games":    recentGames,
			"follow":   follow,
			"comments": userComments.Items,
		},
	})
}

// Retrieves user followers and following users
func (uc UserAPIController) GetUserFollow(c echo.Context) error {

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
func (uc UserAPIController) ResendActivationLink(c echo.Context) error {

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

func (uc UserAPIController) FetchUserboard(c echo.Context) error {

	id := c.Param("id")
	filePath := "static/images/userboards/" + id + ".png"

	// Get file stats
	creationTime, err := utils.GetFileCreated(filePath)
	if err == nil {
		// If file was generated within the last 24 hours, return the file to avoid unnecessary overload on the server. Otherwise, recalculate the stats
		duration := time.Since(creationTime)
		if duration.Hours() < 1 {
			return c.File(filePath)
		}
	}

	// Get user object so we can fetch the stats and username
	userObject, ok := us.GetUser(id)
	if !ok {
		return c.File("static/images/identity/typitap-logo.png") // @TODO: Replace these with actual default image
	}

	// Get user stats and pass it on to the userboard generator
	userStats, ok := stats.GetStatsForUser(userObject.Id)
	if !ok {
		return c.File("static/images/identity/typitap-logo.png") // @TODO: Replace these with actual default image
	}

	graphics.GenerateUserboard(userObject.Username, userObject.Id, userStats)
	return c.File(filePath)

}

func (uc UserAPIController) HandleUserSearch(c echo.Context) error {

	query := c.Param("query")

	if query == "" {
		return c.JSON(200, map[string]interface{}{
			"success": true,
			"data":    []map[string]interface{}{},
		})
	}

	users := us.SearchForUsers(query)

	return c.JSON(200, map[string]interface{}{
		"success": true,
		"data":    users,
	})
}


func (uc UserAPIController) SubmitText(c echo.Context) error {

	data := map[string]interface{}{
		"Text":     c.FormValue("Text"),
		"Source":     c.FormValue("Source"),
		"Type":     c.FormValue("Type"),
		"Code": c.FormValue("Code"),
		"Language": c.FormValue("Language"),
		"Status": 1,
		"IsSubmitted": true,
	}

	if c.Get("IsLoggedIn").(bool) {
		data["User"] = c.Get("User").(entities.User).Id
	} else {
		data["User"] = ""
	}

	isValid, errors := gametexts.ValidateText(data)

	if !isValid {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"success": false,
			"errors":    errors,
		})
	}

	logs.Push("New text submitted", "Someone submitted a new text to review")

	submittedText := gametexts.CreateText(data)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": submittedText.Id != "",
		"data":    submittedText,
	})
}
