package manager

import (
	"github.com/nu7hatch/gouuid"
	"log"
	"github.com/badoux/checkmail"
	errorGen "github.com/pkg/errors"
	"github.com/iKonrad/typitap/server/entities"
	"errors"
	db "github.com/iKonrad/typitap/server/database"
	r "gopkg.in/gorethink/gorethink.v3"
	"golang.org/x/crypto/bcrypt"
)

type UserManager struct {
}

var User UserManager;

var currentUser entities.User;

func init() {
	User = UserManager{};
}

func (um UserManager) CreateUser(details map[string]interface{}) (entities.User, error) {

	isValid, _ := um.ValidateUser(details);

	if (!isValid) {
		return entities.User{}, errorGen.New("Invalid user details");
	}

	newId, error := uuid.NewV4();

	if (error != nil) {
		log.Println("Error while creating a user UUID", error);
		return entities.User{}, errors.New("Issue while creating a UUID key: " + error.Error());
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(details["password"].(string)), bcrypt.DefaultCost);

	if (err != nil) {
		return entities.User{}, errors.New("Error occured while hashing a password: " + err.Error());
	}

	newUser := entities.User{
		Id: newId.String(),
		Name: details["name"].(string),
		Email: details["email"].(string),
		Username: details["username"].(string),
		Active: false,
		Password: string(hashedPassword[:]),
	}

	cursor, err := r.Table("users").Insert(newUser).Run(db.Session);

	if (err != nil) {
		log.Println(err);
	}

	defer cursor.Close();

	return newUser, nil;
}

func (um UserManager) ValidateUser(details map[string]interface{}) (bool, map[string]string) {

	errors := map[string]string{}
	isValid := true;


	// First name validation
	if firstName, ok := details["name"].(string); !ok {
		errors["name"] = "This field cannot be empty"
		isValid = false
	} else {
		if (len(firstName) < 3) {
			errors["name"] = "Name needs to be at least 3 characters long"
			isValid = false
		}
	}


	// First name validation
	if username, ok := details["username"].(string); !ok {
		errors["username"] = "This field cannot be empty"
		isValid = false
	} else {
		if (len(username) < 3) {
			errors["username"] = "Username needs to be at least 3 characters long"
			isValid = false
		} else {
			isAvailable := um.IsUsernameAvailable(username);
			if (!isAvailable) {
				isValid = false;
				errors["username"] = "This username is taken"
			}
		}
	}


	// Email validation
	if email, ok := details["email"].(string); !ok {
		errors["email"] = "This field cannot be empty"
		isValid = false
	} else {
		err := checkmail.ValidateFormat(email);
		if (err != nil) {
			errors["email"] = "Invalid e-mail address";
			isValid = false
		} else {
			isAvailable := um.IsEmailAvailable(email);
			if (!isAvailable) {
				isValid = false;
				errors["email"] = "This e-mail address is taken";
			}
		}
	}


	// Password validation
	if password, ok := details["password"].(string); !ok {
		errors["password"] = "Password cannot be empty"
		isValid = false
	} else {
		if (len(password) < 6) {
			errors["password"] = "Password needs to be at least 6 characters long"
			isValid = false
		}
	}

	return isValid, errors

}

// Checks if there's already an account with provided e-mail address
func (um UserManager) IsEmailAvailable(email string) bool {

	// Check if e-mail exists in the database
	res, _ := r.Table("users").Filter(map[string]interface{}{
		"email": email,
	}).Run(db.Session)

	defer res.Close();

	if (res.IsNil()) {
		return true;
	} else {
		var lol map[string]interface{};
		err := res.One(&lol);
		if (err != nil) {
			log.Println(err);
		}
		return false;
	}

}

// Checks if account with provided username already exists
func (um UserManager) IsUsernameAvailable(username string) bool {

	// Check if e-mail exists in the database
	res, _ := r.Table("users").Filter(map[string]interface{}{
		"username": username,
	}).Run(db.Session)

	defer res.Close();

	if (res.IsNil()) {
		return true;
	} else {
		var lol map[string]interface{};
		err := res.One(&lol);
		if (err != nil) {
			log.Println(err);
		}
		return false;
	}

}

// Fetches the user from the database by the provided key. First return value is a user itself. Second return value is OK/found
func (um UserManager) FindUserBy(key string, value string) (entities.User, bool) {

	res, err := r.Table("users").Filter(map[string]interface{}{
		key: value,
	}).Run(db.Session);

	defer res.Close();

	if (err != nil) {
		return entities.User{}, false
	}

	var returnedUser entities.User;
	err = res.One(&returnedUser);

	if (err != nil) {
		return entities.User{}, false
	}

	return returnedUser, true
}
