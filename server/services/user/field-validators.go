package user

import (
	"github.com/badoux/checkmail"
	"strings"
)

func ValidateUsername(username string) (bool, string) {

	isValid := true
	var fieldError string

	if username == "" {
		fieldError = "This field cannot be empty"
		isValid = false
	} else {
		if len(username) < 3 {
			fieldError = "Username needs to be at least 3 characters long"
			isValid = false
		} else if strings.HasPrefix(username, "guest-") {
			fieldError = "This username is not available"
			isValid = false
		} else {
			isAvailable := IsUsernameAvailable(username)
			if !isAvailable {
				isValid = false
				fieldError = "This username is taken"
			}
		}
	}

	return isValid, fieldError
}

func ValidateName(name string) (bool, string) {

	isValid := true
	var fieldError string

	// First name validation
	if name == "" {
		fieldError = "This field cannot be empty"
		isValid = false
	} else {
		if len(name) < 2 {
			fieldError = "Name needs to be at least 2 characters long"
			isValid = false
		}
	}

	return isValid, fieldError

}

func ValidateEmail(email string) (bool, string) {

	isValid := true
	var fieldError string

	// Email validation
	if email == "" {
		fieldError = "This field cannot be empty"
		isValid = false
	} else {
		err := checkmail.ValidateFormat(email)
		if err != nil {
			fieldError = "Invalid e-mail address"
			isValid = false
		} else {
			isAvailable := IsEmailAvailable(email)
			if !isAvailable {
				isValid = false
				fieldError = "This e-mail address is taken"
			}
		}
	}

	return isValid, fieldError

}

func ValidatePassword(password string) (bool, string) {
	var err string
	isValid := true

	if password == "" {
		err = "Password cannot be empty"
		isValid = false
	} else {
		if len(password) < 8 {
			err = "Password needs to be at least 8 characters long"
			isValid = false
		}
	}
	return isValid, err
}
