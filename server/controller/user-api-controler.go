package controller

import (
	"log"
	"net/http"

	db "github.com/iKonrad/typitap/server/database"
	"github.com/iKonrad/typitap/server/entities"
	"github.com/iKonrad/typitap/server/manager"
	"github.com/labstack/echo"
	r "gopkg.in/gorethink/gorethink.v3"
	"strconv"
	"github.com/iKonrad/typitap/server/feed"
)

type UserAPIController struct {
}

var UserAPI UserAPIController

func init() {
	UserAPI = UserAPIController{}
}

func (gc UserAPIController) GetUserGameResults(c echo.Context) error {

	// Check if user is logged in
	if !c.Get("IsLoggedIn").(bool) {
		return c.JSON(http.StatusMethodNotAllowed, map[string]interface{}{
			"success": false,
		})
	}

	user := c.Get("User").(entities.User)

	var results []map[string]interface{}
	filters := map[string]interface{}{}

	filters["userId"] = user.Id

	if c.QueryParam("online") != "" {
		filters["online"] = true
	}

	if c.QueryParam("finished") != "" {
		filters["finished"] = true
	}

	o := c.QueryParam("offset");
	if o == "" {
		o = "0";
	}

	offset, _ := strconv.Atoi(o);
	resp, err := r.Table("game_results").Filter(filters).OrderBy(r.Desc("created")).Skip(offset).Limit(10).Merge(func(t r.Term) interface{} {
		return map[string]interface{}{
			"session": r.Table("game_sessions").Get(t.Field("sessionId")),
		}
	}).Run(db.Session)
	defer resp.Close()
	if err != nil {
		log.Println(err)
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"error":   "Internal error occurred",
		})
	}

	err = resp.All(&results)
	if err != nil {
		log.Println(err.Error())
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

	// Check if user is logged in
	if !c.Get("IsLoggedIn").(bool) {
		return c.JSON(http.StatusMethodNotAllowed, map[string]interface{}{
			"success": false,
		})
	}

	field := c.FormValue("field")
	value := c.FormValue("value")
	user := c.Get("User").(entities.User)

	switch field {
	case "Name":
		isValid, err := manager.User.ValidateName(value);
		if isValid {
			user.Name = value
		} else {
			return c.JSON(http.StatusOK, map[string]interface{}{
				"success": false,
				"message": err,
			})
		}
	case "Email":
		isValid, err := manager.User.ValidateEmail(value);
		if isValid {
			user.Email = value
		} else {
			return c.JSON(http.StatusOK, map[string]interface{}{
				"success": false,
				"message": err,
			})
		}

	case "Password":

		isValid, err := manager.User.ValidatePassword(value);
		if isValid {
			manager.User.UpdateUserPassword(value, user)
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

	if ok := manager.User.UpdateUser(&user); ok {
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

	// Check if user is logged in
	if !c.Get("IsLoggedIn").(bool) {
		return c.JSON(http.StatusMethodNotAllowed, map[string]interface{}{
			"success": false,
		})
	}

	o := c.QueryParam("offset");
	if o == "" {
		o = "0";
	}

	offset, _ := strconv.Atoi(o)

	user := c.Get("User").(entities.User)

	if userFeed, ok := feed.GetFeedForUser(user.Id, offset); ok {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"success": true,
			"data": userFeed,
		})
	}

	return c.JSON(http.StatusNoContent, map[string]interface{}{
		"success": false,
	})

}
