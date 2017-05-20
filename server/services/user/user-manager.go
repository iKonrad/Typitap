package user

import (
	"errors"
	"log"
	"time"

	"github.com/iKonrad/typitap/server/entities"
	db "github.com/iKonrad/typitap/server/services/database"
	"github.com/nu7hatch/gouuid"
	errorGen "github.com/pkg/errors"
	"golang.org/x/crypto/bcrypt"
	r "gopkg.in/gorethink/gorethink.v3"
)

func CreateUser(details map[string]interface{}) (entities.User, error) {

	isValid, _ := ValidateUser(details)

	if !isValid {
		return entities.User{}, errorGen.New("Invalid user details")
	}

	newId, error := uuid.NewV4()

	if error != nil {
		log.Println("Error while creating a user UUID", error)
		return entities.User{}, errors.New("Issue while creating a UUID key: " + error.Error())
	}

	hashedPassword := generatePassword(details["password"].(string))
	newUser := entities.User{
		Id:       newId.String(),
		Name:     details["name"].(string),
		Email:    details["email"].(string),
		Username: details["username"].(string),
		Active:   false,
		Password: hashedPassword,
	}

	cursor, err := r.Table("users").Insert(newUser).Run(db.Session)

	newFeed := entities.UserFeed{
		User:  newUser,
		Items: []entities.Activity{},
	}

	if err != nil {
		log.Println(err)
	}

	cursor, err = r.Table("user_activity_feed").Insert(newFeed).Run(db.Session)
	if err != nil {
		log.Println(err)
	}

	defer cursor.Close()

	return newUser, nil
}

func ValidateUser(details map[string]interface{}) (bool, map[string]string) {

	fieldErrors := map[string]string{}
	isValid := true

	// First name validation
	fieldValid, err := ValidateName(details["name"].(string))
	if !fieldValid {
		isValid = false
		fieldErrors["name"] = err
	}

	// Username validation
	fieldValid, err = ValidateUsername(details["username"].(string))
	if !fieldValid {
		isValid = false
		fieldErrors["username"] = err
	}

	// Email validation
	fieldValid, err = ValidateEmail(details["email"].(string))
	if !fieldValid {
		isValid = false
		fieldErrors["email"] = err
	}

	// Password validation
	fieldValid, err = ValidatePassword(details["password"].(string))
	if !fieldValid {
		isValid = false
		fieldErrors["password"] = err
	}

	return isValid, fieldErrors

}

func generatePassword(password string) string {
	generatedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(generatedPassword[:])
}

// Checks if there's already an account with provided e-mail address
func IsEmailAvailable(email string) bool {

	// Check if e-mail exists in the database
	res, _ := r.Table("users").Filter(map[string]interface{}{
		"email": email,
	}).Run(db.Session)

	defer res.Close()

	if res.IsNil() {
		return true
	} else {
		var lol map[string]interface{}
		err := res.One(&lol)
		if err != nil {
			log.Println(err)
		}
		return false
	}

}

// Checks if account with provided username already exists
func IsUsernameAvailable(username string) bool {

	// Check if e-mail exists in the database
	res, _ := r.Table("users").Filter(map[string]interface{}{
		"username": username,
	}).Run(db.Session)

	defer res.Close()

	if res.IsNil() {
		return true
	} else {
		var lol map[string]interface{}
		err := res.One(&lol)
		if err != nil {
			log.Println(err)
		}
		return false
	}

}

// Fetches the user from the database by the provided key. First return value is a user itself. Second return value is OK/found
func FindUserBy(key string, value string) (entities.User, bool) {

	res, err := r.Table("users").Filter(map[string]interface{}{
		key: value,
	}).Run(db.Session)

	defer res.Close()

	if res.IsNil() {
		return entities.User{}, false
	}

	var returnedUser entities.User
	err = res.One(&returnedUser)

	if err != nil {
		log.Println(err)
		return entities.User{}, false
	}

	return returnedUser, true
}

func GetUser(id string) (entities.User, bool) {

	res, err := r.Table("users").Get(id).Run(db.Session)

	defer res.Close()

	if res.IsNil() {
		return entities.User{}, false
	}

	var returnedUser entities.User
	err = res.One(&returnedUser)

	if err != nil {
		return entities.User{}, false
	}

	return returnedUser, true

}

func GenerateUserToken(tokenType string, user entities.User) (string, bool) {

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

func ActivateUser(userId string) bool {

	err := r.Table("users").Get(userId).Update(map[string]interface{}{
		"active": true,
	}).Exec(db.Session)
	return err == nil
}

func UpdateUserPassword(password string, user entities.User) bool {

	hashedPassword := generatePassword(password)
	r.Table("users").Get(user.Id).Update(map[string]interface{}{
		"password": hashedPassword,
	}).Exec(db.Session)
	return true
}

func UpdateUser(user *entities.User) bool {

	r.Table("users").Get(user.Id).Update(map[string]interface{}{
		"name":   user.Name,
		"active": user.Active,
		"email":  user.Email,
	}).Exec(db.Session)
	return true
}

func SanitizeUser(user *entities.User) {

	user.Email = ""
	user.Password = ""
}
