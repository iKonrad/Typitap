package user

import (
	"log"
	"time"

	"github.com/iKonrad/typitap/server/entities"
	db "github.com/iKonrad/typitap/server/services/database"
	"github.com/nu7hatch/gouuid"
	r "gopkg.in/gorethink/gorethink.v3"
)

const (
	TOKEN_CHANGE_EMAIL = "change_email"
	TOKEN_ACTIVATE = "activate"
	TOKEN_PASSWORD_CHANGE = "password"
)


func GenerateUserToken(tokenType string, user entities.User, value string) (string, bool) {

	// Generate activation token
	tokenString, _ := uuid.NewV4()
	expiresDate := time.Now()
	expiresDate.AddDate(0, 1, 0)
	token := entities.UserToken{
		User:    user,
		Token:   tokenString.String(),
		Expires: expiresDate,
		Used:    false,
		Type:    tokenType,
		Value: value,
	}

	res, err := r.Table("tokens").Insert(token).Run(db.Session)
	defer res.Close()
	if err != nil {
		log.Println(err)
		return "", false
	}

	return tokenString.String(), true

}

func GetUserToken(token string, tokenType string) (entities.UserToken, bool) {

	res, err := r.Table("tokens").Filter(map[string]interface{}{
		"token": token,
		"type":  tokenType,
		"used":  false, // @TODO: Add expires condition
	}).Merge(func(p r.Term) interface{} {
		return map[string]interface{}{
			"userId": r.Table("users").Get(p.Field("userId")),
		}
	}).Run(db.Session)
	defer res.Close()
	if err != nil {
		log.Println(err)
		return entities.UserToken{}, false
	}

	var tokenObject entities.UserToken
	err = res.One(&tokenObject)
	if err != nil {
		log.Println(err)
		return entities.UserToken{}, false
	}

	return tokenObject, true

}

func RemoveTokensForUser(tokenType string, userId string) {

	r.Table("user_tokens").Filter(map[string]interface{}{
		"type":   tokenType,
		"userId": userId,
	}).Delete().RunWrite(db.Session)

}

func UseUserToken(token string, tokenType string) bool {

	res, err := r.Table("tokens").Filter(map[string]interface{}{
		"token": token,
		"type":  tokenType,
		"used":  false,
	}).Update(map[string]interface{}{
		"used": true,
	}).Run(db.Session)

	defer res.Close()

	if err != nil {
		return false
	}

	return true
}
