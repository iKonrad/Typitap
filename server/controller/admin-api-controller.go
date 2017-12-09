package controller

import (
	"log"
	"net/http"

	"strconv"
	"time"

	"github.com/iKonrad/typitap/server/entities"
	db "github.com/iKonrad/typitap/server/services/database"
	"github.com/iKonrad/typitap/server/services/gametexts"
	"github.com/iKonrad/typitap/server/services/mail"
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
		log.Println("Error while fetching levels, ", err.Error())
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

func (uc AdminAPIController) GetTexts(c echo.Context) error {

	resp, err := r.Table("game_texts").Merge(func(p r.Term) interface{} {
		return map[string]interface{}{
			"language": r.Table("languages").Get(p.Field("language")),
			"user":     r.Table("users").Get(p.Field("user")).Default(map[string]interface{}{"username": ""}).Pluck("username"),
		}
	}).Run(db.Session)
	if err != nil {
		log.Println("Error while fetching texts, ", err.Error())
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
		})
	}

	var texts []entities.GameText
	err = resp.All(&texts)

	if texts == nil {
		texts = []entities.GameText{}
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    texts,
	})

}

func (uc AdminAPIController) GetText(c echo.Context) error {
	textId := c.Param("id")
	text, ok := gametexts.GetText(textId)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": ok,
		"data":    text,
	})
}

func (uc AdminAPIController) SaveText(c echo.Context) error {

	textId := c.Param("id")

	data := map[string]interface{}{
		"Text":     c.FormValue("Text"),
		"Source":   c.FormValue("Source"),
		"Type":     c.FormValue("Type"),
		"Code":     c.FormValue("Code"),
		"Language": c.FormValue("Language"),
	}

	isValid, errors := gametexts.ValidateText(data)

	if !isValid {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"success": false,
			"errors":  errors,
		})
	}

	var updatedText entities.GameText

	// If textID is empty or set as "new", add new text to the database
	if textId == "" || textId == "new" {
		data["IsSubmitted"] = false
		data["Status"] = "2"
		updatedText = gametexts.CreateText(data)
	} else {
		// Otherwise, update the existing entry
		updatedText = gametexts.UpdateText(textId, data)
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": updatedText.Id != "",
		"data":    updatedText,
	})
}

func (uc AdminAPIController) AcceptText(c echo.Context) error {
	textId := c.Param("id")

	// Get the text first to see if we should send a confirmation e-mail
	text, ok := gametexts.GetText(textId)
	if !ok {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"success": false,
		})
	}

	updatedText := gametexts.UpdateText(textId, map[string]interface{}{
		"Status": "2",
	})

	if updatedText.Id != "" && updatedText.User.Email != "" && text.Status == gametexts.STATUS_SUBMITTED {
		mail.SendEmail(updatedText.User.Email, mail.TEMPLATE_TEXT_ACCEPTED, mail.TemplateTextAccepted(
			updatedText.User.Name,
			updatedText.User.Username,
			updatedText.Text,
		))
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": updatedText.Id != "",
		"data":    updatedText,
	})
}

func (uc AdminAPIController) RejectText(c echo.Context) error {
	textId := c.Param("id")

	updatedText := gametexts.UpdateText(textId, map[string]interface{}{
		"Status": "0",
	})

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": updatedText.Id != "",
		"data":    updatedText,
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

	switch table {
	case "users":
		return uc.updateUserTable(c)
	case "levels":
		return uc.updateLevelsTable(c)
	default:
		return uc.updateTextsTable(c)
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

func (uc AdminAPIController) updateTextsTable(c echo.Context) error {

	table := c.FormValue("table")
	id := c.FormValue("id")
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
