package user

import (
	"encoding/json"
	"errors"
	"log"
	"time"

	"github.com/iKonrad/typitap/server/entities"
	db "github.com/iKonrad/typitap/server/services/database"
	"github.com/iKonrad/typitap/server/services/stats"
	"github.com/nu7hatch/gouuid"
	errorGen "github.com/pkg/errors"
	"golang.org/x/crypto/bcrypt"
	r "gopkg.in/gorethink/gorethink.v3"
	"github.com/oschwald/geoip2-golang"
	"net"
	"github.com/pariz/gountries"
	"github.com/iKonrad/typitap/server/config"
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
		Role:     "ROLE_USER",
		Created:  time.Now(),
		Password: hashedPassword,
		Exp:      0,
		Level:    1,
	}

	cursor, err := r.Table("users").Insert(newUser).Run(db.Session)

	if err != nil {
		log.Println(err)
	} else {
		newFeed := entities.UserFeed{
			User:  newUser,
			Items: []entities.Activity{},
		}

		cursor, err = r.Table("user_feed_activity").Insert(newFeed).Run(db.Session)
		if err != nil {
			log.Println(err)
		}
		defer cursor.Close()

		newStats := stats.NewStats(newUser)

		statsCursor, err := r.Table("user_stats").Insert(newStats).Run(db.Session)
		if err != nil {
			log.Println(err)
		}
		defer statsCursor.Close()

		// Create user follow table
		newUserFollow := entities.UserFeedFollow{
			User: newUser,
		}

		followCursor, err := r.Table("user_feed_follow").Insert(newUserFollow).Run(db.Session)
		if err != nil {
			log.Println(err)
		}
		defer followCursor.Close()

	}

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

func UserExists(id string) bool {

	res, err := r.Table("users").Get(id).Run(db.Session)
	defer res.Close()
	if err != nil || res.IsNil() {
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
		"name":           user.Name,
		"active":         user.Active,
		"email":          user.Email,
		"keyboard":       user.Keyboard,
		"bio":            user.Bio,
		"keyboardLayout": user.KeyboardLayout,
		"country": user.Country,
	}).Exec(db.Session)
	return true
}

func SanitizeUser(user *entities.User) {

	user.Email = ""
	user.Password = ""
}

func GetGameResultsForUser(offset int, filters map[string]interface{}) ([]map[string]interface{}, bool) {
	var results []map[string]interface{}
	resp, err := r.Table("game_results").Filter(filters).OrderBy(r.Desc("created")).Skip(offset).Limit(10).Merge(func(t r.Term) interface{} {
		return map[string]interface{}{
			"session": r.Table("game_sessions").Get(t.Field("sessionId")),
		}
	}).Run(db.Session)
	defer resp.Close()

	if err != nil || resp.IsNil() {
		log.Println(err.Error())
		return []map[string]interface{}{}, false
	}
	err = resp.All(&results)

	if err != nil {
		log.Println(err.Error())
		return []map[string]interface{}{}, false
	}

	return results, true

}

func ConvertUserToMap(u *entities.User) map[string]interface{} {

	var us map[string]interface{}
	var inInterface interface{}
	inrec, _ := json.Marshal(u)
	json.Unmarshal(inrec, &inInterface)
	us = inInterface.(map[string]interface{})

	return us
}

// Returns an array of usernames for a given search keyword
func SearchForUsers(query string) []map[string]interface{} {

	resp, err := r.Table("users").Filter(func(row r.Term) r.Term {
		return r.Expr([]string{"username", "name"}).Contains(func(key r.Term) r.Term {
			return row.Field(key).CoerceTo("string").Match("(?i)" + query)
		})
	}).Pluck("username", "email", "name").Run(db.Session)

	defer resp.Close()

	if err != nil {
		log.Println("Error while searching for users:", err)
		return []map[string]interface{}{}
	}

	// If nothing is found, return an empty array
	if resp.IsNil() {
		return []map[string]interface{}{}
	}

	var searchUsers []map[string]interface{}
	err = resp.All(&searchUsers)

	if err != nil {
		log.Println("Error while pulling users:", err)
		return []map[string]interface{}{}
	}

	return searchUsers

}

func GetCountryCodeByIP(ipAddress string) (string, bool) {

	countryDb, err := geoip2.Open(config.Config.UString("countries"))

	ip := net.ParseIP(ipAddress)
	city, err := countryDb.City(ip);
	cityName := city.Country.Names["en"]

	query := gountries.New()
	country, err := query.FindCountryByName(cityName)

	return country.Alpha2, err != nil

}

func GetCountryCodeByName(name string) (string, bool) {

	query := gountries.New()
	country, err := query.FindCountryByName(name)

	return country.Alpha2, err != nil

}

func ValidateCountryCode(code string) (string, bool) {

	query := gountries.New()
	country, err := query.FindCountryByAlpha(code)

	return country.Alpha2, err == nil

}