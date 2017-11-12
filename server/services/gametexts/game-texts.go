package gametexts

import (
	"log"

	"strconv"

	"github.com/iKonrad/typitap/server/entities"
	db "github.com/iKonrad/typitap/server/services/database"
	"github.com/nu7hatch/gouuid"
	r "gopkg.in/gorethink/gorethink.v3"
)

const TEXT_MIN_LENGTH = 160
const TEXT_MAX_LENGTH = 240

func GetText(textId string) (entities.GameText, bool) {
	resp, err := r.Table("game_texts").Get(textId).Merge(func(p r.Term) interface{} {
		return map[string]interface{}{
			"language": r.Table("languages").Get(p.Field("language")),
			"user":     r.Table("users").Get(p.Field("user")).Default(map[string]interface{}{"username": "", "name": ""}),
		}
	}).Run(db.Session)

	if err != nil {
		log.Println("Error while fetching texts", err.Error())
		return entities.GameText{}, false
	}

	var text entities.GameText
	err = resp.One(&text)

	if err != nil {
		return entities.GameText{}, false
	}

	return text, true
}

func UpdateText(textId string, data map[string]interface{}) entities.GameText {

	text := map[string]interface{}{}

	if data["Text"] != nil {
		text["text"] = data["Text"].(string)
	}

	if data["Status"] != nil {
		status, _ := strconv.Atoi(data["Status"].(string))
		text["status"] = status
	}

	if data["Source"] != nil {
		text["source"] = data["Source"].(string)
	}

	if data["Type"] != nil {
		text["type"] = data["Type"].(string)
	}

	if data["Code"] != nil {
		text["code"] = data["Code"].(string)
	}

	if data["Language"] != nil {
		text["language"] = data["Language"].(string)
	}

	if data["User"] != nil {
		text["user"] = data["User"].(string)
	}

	r.Table("game_texts").Get(textId).Update(text).Exec(db.Session)
	newText, _ := GetText(textId)

	return newText
}

func CreateText(data map[string]interface{}) entities.GameText {
	newId, _ := uuid.NewV4()

	statusString, ok := data["Status"].(string)

	if !ok {
		statusString = "1"
	}
	status, _ := strconv.Atoi(statusString)

	text := entities.GameText{
		Id:     newId.String(),
		Text:   data["Text"].(string),
		Status: status,
		Source: data["Source"].(string),
		Code:   data["Code"].(string),
		Type:   data["Type"].(string),
		Language: entities.Language{
			Id: data["Language"].(string),
		},
	}

	textMap := map[string]interface{}{
		"text":     data["Text"].(string),
		"source":   data["Source"].(string),
		"type":     data["Type"].(string),
		"code":     data["Code"].(string),
		"status":   status,
		"language": data["Language"].(string),
	}

	if data["IsSubmitted"] != nil {
		text.IsSubmitted = data["IsSubmitted"].(bool)
		textMap["isSubmitted"] = data["IsSubmitted"].(bool)
	}

	userId, ok := data["User"]
	if ok {
		text.User = entities.User{
			Id: userId.(string),
		}
		textMap["user"] = userId.(string)
	}

	_, err := r.Table("game_texts").Insert(textMap).Run(db.Session)

	if err != nil {
		log.Println("Error while creating a text", err)
	}

	return text
}

func ValidateText(data map[string]interface{}) (bool, map[string]string) {
	fieldErrors := map[string]string{}
	isValid := true

	text := data["Text"].(string)
	if text == "" {
		fieldErrors["Text"] = "This field cannot be empty"
		isValid = false
	} else {
		if len(text) < TEXT_MIN_LENGTH || len(text) > TEXT_MAX_LENGTH {
			isValid = false
			fieldErrors["Text"] = "Text should be between " + strconv.Itoa(TEXT_MIN_LENGTH) + " and " + strconv.Itoa(TEXT_MAX_LENGTH) + " characters long"
		}
	}

	// @TODO: Update this with ASIN/ISBN validation
	//isbn := data["ISBN"].(string)
	//if isbn != "" {
	//	validate := validator.New()
	//	err := validate.Var(isbn, "isbn")
	//	if err != nil {
	//		isValid = false
	//		fieldErrors["ISBN"] = "Invalid ISBN number"
	//	}
	//}

	return isValid, fieldErrors

}

func GetTextLanguages() []entities.Language {
	resp, err := r.Table("languages").Run(db.Session)
	if err != nil {
		log.Println("Error while fetching languages", err.Error())
		return []entities.Language{}
	}

	var languages []entities.Language
	err = resp.All(&languages)

	if err != nil {
		return []entities.Language{}
	}
	return languages
}

// Retrieves list of languages that are actually used by texts in game
func GetActiveTextLanguages() []entities.Language {
	resp, err := r.Table("game_texts").Pluck("language").Distinct().Merge(func(p r.Term) interface{} {
		return map[string]interface{}{
			"language": r.Table("languages").Get(p.Field("language")),
		}
	}).Run(db.Session)

	if err != nil {
		log.Println("Error while fetching languages", err.Error())
		return []entities.Language{}
	}

	var resultMap []map[string]map[string]interface{}
	var languages []entities.Language
	err = resp.All(&resultMap)

	if err != nil {
		return []entities.Language{}
	}

	for _, row := range resultMap {
		if row != nil && row["language"] != nil {
			languages = append(languages, entities.Language{
				Id:   row["language"]["id"].(string),
				Name: row["language"]["name"].(string),
			})
		}
	}

	return languages
}
