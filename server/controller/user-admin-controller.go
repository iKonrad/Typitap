package controller

import (
	"log"
	"net/http"

	"strconv"
	"time"

	db "github.com/iKonrad/typitap/server/services/database"
	"github.com/labstack/echo"
	r "gopkg.in/gorethink/gorethink.v3"
)

type UserAPIAdminController struct {
}

var UserAPIAdmin UserAPIAdminController

func init() {
	UserAPIAdmin = UserAPIAdminController{}
}

func (uc UserAPIAdminController) GetUsers(c echo.Context) error {

	resp, err := r.Table("users").Without("password").Run(db.Session)
	if err != nil {
		log.Println("Error while fetching users, ", err.Error())
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
		})
	}

	var users []map[string]interface{}
	err = resp.All(&users)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    users,
	})
}

func (uc UserAPIAdminController) UpdateTableField(c echo.Context) error {

	table := c.FormValue("table")
	id := c.FormValue("id")
	property := c.FormValue("property")
	stringValue := c.FormValue("value")
	propertyType := c.FormValue("type")

	if table == "" || property == "" || stringValue == "" || id == "" {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"success": false,
		})
	}

	updateValues :=  make(map[string]interface{})

	switch propertyType {
	case "":
		updateValues[property] = stringValue
	case "string":
		updateValues[property] = stringValue
	case "int":
		intVal, _ := strconv.Atoi(stringValue)
		updateValues[property] = intVal
	case "time":
		timeVal, _ := time.Parse(time.RFC3339, stringValue)
		log.Println(timeVal);
		updateValues[property] = timeVal
	case "bool":
		boolVal := false;
		if stringValue == "1" || stringValue == "true" || stringValue == "yes" {
			boolVal = true;
		}
		updateValues[property] = boolVal
	}

	r.Table(table).Get(id).Update(updateValues).RunWrite(db.Session)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
	})
}
