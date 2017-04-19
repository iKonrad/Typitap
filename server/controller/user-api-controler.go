package controller

import (
	"github.com/iKonrad/typitap/server/entities"
	"github.com/labstack/echo"
	r "gopkg.in/gorethink/gorethink.v3"
	db "github.com/iKonrad/typitap/server/database"
	"net/http"
	"log"
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

	var results []map[string]interface{};
	filters := map[string]interface{}{}

	filters["userId"] = user.Id

	if c.QueryParam("online") != "" {
		filters["online"] = true
	}


	if c.QueryParam("finished") != "" {
		filters["finished"] = true
	}

	resp, err := r.Table("game_results").Filter(filters).OrderBy(r.Desc("created")).Merge(func(t r.Term) interface{} {
		return map[string]interface{} {
			"session": r.Table("game_sessions").Get(t.Field("sessionId")),
		}
	}).Run(db.Session);

	defer resp.Close();

	if err != nil {
		log.Println(err);
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"error": "Internal error occurred",
		});
	}

	err = resp.All(&results);

	if err != nil {
		log.Println(err.Error());
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"error": "Internal error occurred",
		});
	}


	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
		"data": results,
	});
}