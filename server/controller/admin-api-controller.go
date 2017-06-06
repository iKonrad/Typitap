package controller

import (
	"log"
	"net/http"

	"strconv"
	"time"

	"github.com/iKonrad/typitap/server/entities"
	db "github.com/iKonrad/typitap/server/services/database"
	"github.com/labstack/echo"
	r "gopkg.in/gorethink/gorethink.v3"
)

type AdminAPIController struct {
}

var AdminAPI AdminAPIController

func init() {
	AdminAPI = AdminAPIController{}
}

func (uc AdminAPIController) GetUsers(c echo.Context) error {

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

func (uc AdminAPIController) GetLevels(c echo.Context) error {

	resp, err := r.Table("levels").Run(db.Session)
	if err != nil {
		log.Println("Error while fetching users, ", err.Error())
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
		})
	}

	var levels []entities.Level
	err = resp.All(&levels)

	if levels == nil {
		levels = []entities.Level{}
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    levels,
	})
}

func (uc AdminAPIController) UpdateTableField(c echo.Context) error {

	table := c.FormValue("table")
	id := c.FormValue("id")
	property := c.FormValue("property")
	stringValue := c.FormValue("value")

	if table == "" || property == "" || stringValue == "" || id == "" {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"success": false,
		})
	}

	if table == "users" {
		return uc.updateUserTable(c)
	} else {
		return uc.updateLevelsTable(c)
	}

}

func (uc AdminAPIController) updateUserTable(c echo.Context) error {

	table := c.FormValue("table")
	id := c.FormValue("id")
	property := c.FormValue("property")
	stringValue := c.FormValue("value")
	propertyType := c.FormValue("type")

	updateValues := uc.convertProperty(property, stringValue, propertyType)

	resp, err := r.Table(table).Get(id).Update(updateValues).Run(db.Session)

	defer resp.Close()
	log.Println(err)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
	})

}

func (uc AdminAPIController) updateLevelsTable(c echo.Context) error {

	table := c.FormValue("table")
	id, _ := strconv.Atoi(c.FormValue("id"))
	property := c.FormValue("property")
	stringValue := c.FormValue("value")
	propertyType := c.FormValue("type")

	updateValues := uc.convertProperty(property, stringValue, propertyType)

	r.Table(table).Get(id).Update(updateValues).RunWrite(db.Session)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
	})

}

func (uc AdminAPIController) convertProperty(property string, stringValue string, propertyType string) map[string]interface{} {
	updateValues := make(map[string]interface{})

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
		updateValues[property] = timeVal
	case "bool":
		boolVal := false
		if stringValue == "1" || stringValue == "true" || stringValue == "yes" {
			boolVal = true
		}
		updateValues[property] = boolVal
	}

	return updateValues

}
