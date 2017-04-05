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


func init() {
	User = UserManager{};
}

func (um UserManager) NewUser(details map[string]interface{}) (entities.User, error) {

	isValid, _ := um.ValidateUser(details);

	if (!isValid) {
		return entities.User{}, errorGen.New("Invalid user details");
	}

	newId, error := uuid.NewV4();

	if (error == nil) {
		log.Println("Error while creating a user UUID", error);
		return entities.User{}, errors.New("Issue while creating a UUID key");
	}

	newUser := entities.User{
		Id: newId.String(),
		FirstName: details["FirstName"].(string),
		LastName: details["LastName"].(string),
		Email: details["Email"].(string),

	}

	return newUser, nil;
}

func (um UserManager) ValidateUser(details map[string]interface{}) (bool, map[string]string) {

	errors := map[string]string{}
	isValid := true;


	// First name validation
	firstName, err := details["FirstName"].(string)
	if (err) {
		errors["FirstName"] = "This field cannot be empty"
		isValid = false
	} else {
		if (len(firstName) < 3) {
			errors["FirstName"] = "First name needs to be at least 3 characters long"
			isValid = false
		}
	}

	// Last name validation
	lastName, err := details["LastName"].(string)
	if (err) {
		errors["LastName"] = "This field cannot be empty"
		isValid = false
	} else {
		if (len(lastName) < 3) {
			errors["LastName"] = "Last name needs to be at least 3 characters long"
			isValid = false
		}
	}

	// Email validation
	email, err := details["Email"].(string)
	if (err) {
		errors["Email"] = "This field cannot be empty"
		isValid = false
	} else {
		err := checkmail.ValidateFormat(email);
		if (err != nil) {
			errors["Email"] = "Invalid e-mail address";
		} else {
			err := checkmail.ValidateHost(email);
			if (err != nil) {
				errors["Email"] = "Invalid e-mail address"
			}
		}
	}

	// Password validation
	password, err := details["Password"].(string)
	if (err) {
		errors["Password"] = "Password cannot be empty"
		isValid = false
	} else {
		if (len(password) < 6) {
			errors["Password"] = "Password needs to be at least 6 characters long"
			isValid = false
		}
	}

	return isValid, errors

}
