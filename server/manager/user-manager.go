package manager

import (
	"github.com/nu7hatch/gouuid"
	"log"
	"github.com/badoux/checkmail"
	errorGen "github.com/pkg/errors"
	"github.com/iKonrad/typitap/server/entities"
	"errors"
)

type UserManager struct {
}

var User UserManager;

// Stores a current Logged in user. Otherwise nil
var currentUser *entities.User

// Stores value about the logged in status
var isLoggedIn bool = false;


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
		return entities.User{}, errors.New("Issue while creating a UUID key");
	}

	newUser := entities.User{
		Id: newId.String(),
		Name: details["name"].(string),
		Email: details["email"].(string),
		Username: details["username"].(string),

	}

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
