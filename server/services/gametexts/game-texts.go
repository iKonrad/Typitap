package gametexts

import (
	"log"

	"strconv"

	"github.com/iKonrad/typitap/server/entities"
	db "github.com/iKonrad/typitap/server/services/database"
	"github.com/nu7hatch/gouuid"
	r "gopkg.in/gorethink/gorethink.v3"
	"gopkg.in/go-playground/validator.v9"
)

const TEXT_MIN_LENGTH = 160
const TEXT_MAX_LENGTH = 240

func GetText(textId string) (entities.GameText, bool) {
	resp, err := r.Table("game_texts").Get(textId).Merge(func(p r.Term) interface{} {
		return map[string]interface{}{
			"language": r.Table("languages").Get(p.Field("language")),
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

	isDisabled := false
	if data["Disabled"].(string) == "true" {
		isDisabled = true
	}

	text := entities.GameText{
		Id:       textId,
		Text:     data["Text"].(string),
		ISBN:     data["ISBN"].(string),
		Disabled: isDisabled,
		Language: entities.Language{
			Id: data["Language"].(string),
		},
	}

	r.Table("game_texts").Get(textId).Update(text).Exec(db.Session)
	return text
}

func CreateText(data map[string]interface{}) entities.GameText {

	newId, _ := uuid.NewV4()

	isDisabled := false
	if data["Disabled"].(string) == "true" {
		isDisabled = true
	}

	text := entities.GameText{
		Id:       newId.String(),
		Text:     data["Text"].(string),
		ISBN:     data["ISBN"].(string),
		Disabled: isDisabled,
	}

	r.Table("game_texts").Insert(text).Update(map[string]interface{}{
		"language": data["Language"].(string),
	}).Exec(db.Session)
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

	isbn := data["ISBN"].(string)
	if isbn != "" {
		validate := validator.New()
		err := validate.Var(isbn, "isbn")
		if err != nil {
			isValid = false
			fieldErrors["ISBN"] = "Invalid ISBN number"
		}
	}

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
	resp, err := r.Table("game_texts").Pluck("language").Distinct().Merge(func (p r.Term) interface{} {
		return map[string]interface{} {
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
				Id: row["language"]["id"].(string),
				Name: row["language"]["name"].(string),
			})
		}
	}

	return languages
}