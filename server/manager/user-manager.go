package manager

import (
	"errors"
	"github.com/badoux/checkmail"
	db "github.com/iKonrad/typitap/server/database"
	"github.com/iKonrad/typitap/server/entities"
	"github.com/nu7hatch/gouuid"
	errorGen "github.com/pkg/errors"
	"golang.org/x/crypto/bcrypt"
	r "gopkg.in/gorethink/gorethink.v3"
	"log"
	"time"
)

type UserManager struct {
}

var User UserManager

var currentUser entities.User

func init() {
	User = UserManager{}
}

func (um UserManager) CreateUser(details map[string]interface{}) (entities.User, error) {

	isValid, _ := um.ValidateUser(details)

	if !isValid {
		return entities.User{}, errorGen.New("Invalid user details")
	}

	newId, error := uuid.NewV4()

	if error != nil {
		log.Println("Error while creating a user UUID", error)
		return entities.User{}, errors.New("Issue while creating a UUID key: " + error.Error())
	}

	hashedPassword := um.generatePassword(details["password"].(string));

	newUser := entities.User{
		Id:       newId.String(),
		Name:     details["name"].(string),
		Email:    details["email"].(string),
		Username: details["username"].(string),
		Active:   false,
		Password: hashedPassword,
	}

	cursor, err := r.Table("users").Insert(newUser).Run(db.Session)

	if err != nil {
		log.Println(err)
	}

	defer cursor.Close()

	return newUser, nil
}

func (um UserManager) ValidateUser(details map[string]interface{}) (bool, map[string]string) {

	errors := map[string]string{}
	isValid := true

	// First name validation
	if firstName, ok := details["name"].(string); !ok {
		errors["name"] = "This field cannot be empty"
		isValid = false
	} else {
		if len(firstName) < 3 {
			errors["name"] = "Name needs to be at least 3 characters long"
			isValid = false
		}
	}

	// First name validation
	if username, ok := details["username"].(string); !ok {
		errors["username"] = "This field cannot be empty"
		isValid = false
	} else {
		if len(username) < 3 {
			errors["username"] = "Username needs to be at least 3 characters long"
			isValid = false
		} else {
			isAvailable := um.IsUsernameAvailable(username)
			if !isAvailable {
				isValid = false
				errors["username"] = "This username is taken"
			}
		}
	}

	// Email validation
	if email, ok := details["email"].(string); !ok {
		errors["email"] = "This field cannot be empty"
		isValid = false
	} else {
		err := checkmail.ValidateFormat(email)
		if err != nil {
			errors["email"] = "Invalid e-mail address"
			isValid = false
		} else {
			isAvailable := um.IsEmailAvailable(email)
			if !isAvailable {
				isValid = false
				errors["email"] = "This e-mail address is taken"
			}
		}
	}

	// Password validation
	if password, ok := details["password"].(string); !ok {
		errors["password"] = "Password cannot be empty"
		isValid = false
	} else {
		if len(password) < 6 {
			errors["password"] = "Password needs to be at least 6 characters long"
			isValid = false
		}
	}

	return isValid, errors

}

func (um UserManager) generatePassword(password string) string{
	generatedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost);
	return string(generatedPassword[:])
}

// Checks if there's already an account with provided e-mail address
func (um UserManager) IsEmailAvailable(email string) bool {

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
func (um UserManager) IsUsernameAvailable(username string) bool {

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
func (um UserManager) FindUserBy(key string, value string) (entities.User, bool) {

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
		log.Println(err);
		return entities.User{}, false
	}

	return returnedUser, true
}


func (um UserManager) GenerateUserToken(tokenType string, user entities.User) (string, bool) {

	// Generate activation token
	tokenString, _ := uuid.NewV4();
	expiresDate := time.Now();
	expiresDate.AddDate(0, 1, 0);

	token := entities.UserToken{
		User: user,
		Token: tokenString.String(),
		Expires: expiresDate,
		Used: false,
		Type: tokenType,
	}

	res, err := r.Table("tokens").Insert(token).Run(db.Session);
	defer res.Close();

	if err != nil {
		log.Println(err);
		return "", false
	}


	return tokenString.String(), true

}

func (um UserManager) GetUserToken(token string, tokenType string) (entities.UserToken, bool) {

	res, err := r.Table("tokens").Filter(map[string]interface{}{
		"token": token,
		"type": tokenType,
		"used": false, // @TODO: Add expires condition
	}).Merge(func (p r.Term) interface {} {
		return map[string]interface{} {
			"userId": r.Table("users").Get(p.Field("userId")),
		}
	}).Run(db.Session);
	defer res.Close();

	if err != nil {
		log.Println(err);
		return entities.UserToken{}, false
	}

	var tokenObject entities.UserToken;
	err = res.One(&tokenObject);

	if err != nil {
		log.Println(err);
		return entities.UserToken{}, false
	}



	return tokenObject, true

}

func (um UserManager) UseUserToken(token string, tokenType string) bool {

	res, err := r.Table("tokens").Filter(map[string]interface{}{
		"token": token,
		"type": tokenType,
		"used": false,
	}).Update(map[string]interface{}{
		"used": true,
	}).Run(db.Session)

	defer res.Close()

	if err != nil {
		return false
	}

	return true
}


func (um UserManager) ActivateUser(userId string) bool {

	err := r.Table("users").Get(userId).Update(map[string]interface{}{
		"active": true,
	}).Exec(db.Session);

	return err == nil
}


func (um UserManager) ValidatePassword(password string) (bool, map[string]interface{}) {
	var err = map[string]interface{}{}
	isValid := true

	if password == "" {
		err["password"] = "Password cannot be empty"
		isValid = false
	} else {
		if len(password) < 6 {
			err["password"] = "Password needs to be at least 6 characters long"
			isValid = false
		}
	}
	return isValid, err
}


func (um UserManager) UpdateUserPassword(password string, user entities.User) bool {

	hashedPassword := um.generatePassword(password);


	r.Table("users").Get(user.Id).Update(map[string]interface{}{
		"password": hashedPassword,
	}).Exec(db.Session);

	return true
}