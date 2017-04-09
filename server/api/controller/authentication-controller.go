package controllers

import (
	"github.com/iKonrad/typitap/server/entities"
	"github.com/iKonrad/typitap/server/manager"
	"github.com/labstack/echo"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
)

type AuthenticationController struct {
}

var AuthenticationC AuthenticationController

func init() {
	AuthenticationC = AuthenticationController{}
}

func (api *AuthenticationController) TestHandler(c echo.Context) error {
	return c.JSON(200, "{'error': 'Nice, it worked'}")
}

func (a *AuthenticationController) HandleSignup(c echo.Context) error {

	// @TODO: Check if user is logged in first

	if c.Get("IsLoggedIn").(bool) {
		return c.JSON(200, map[string]interface{}{"success": false, "error": "You are logged in"})
	}

	// Get form data
	details := map[string]interface{}{
		"name":     c.FormValue("name"),
		"email":    c.FormValue("email"),
		"password": c.FormValue("password"),
		"username": c.FormValue("username"),
	}

	// Validate user details
	isValid, errors := manager.User.ValidateUser(details)

	if !isValid {
		response := map[string]interface{}{
			"success": false,
			"errors":  errors,
		}
		return c.JSON(200, response)
	}

	// Data is valid, so we can create a new user now
	newUser, err := manager.User.CreateUser(details)

	if err != nil {
		log.Println(err)
	}

	// Now, that we have a user, we can log in automatically

	session, err := manager.Session.Get(c.Request(), "SESSION_ID")
	if err != nil {
		// The session is incorrect. We should remove the cookie.
		cookie := http.Cookie{
			Name:   "SESSION_ID",
			Value:  "",
			MaxAge: -1,
		}
		c.SetCookie(&cookie)
		return c.JSON(200, map[string]interface{}{"success": false, "error": "An error occurred while logging in. Please try again"})
	}

	if !session.IsNew {
		return c.JSON(200, map[string]interface{}{"success": false, "error": "You are logged in"})
	}

	sessionCookie := entities.SessionCookie{
		UserId: newUser.Id,
		Role:   "ADMIN", // @TODO: Replace this when roles are implemented
	}

	session.Values["SessionCookie"] = sessionCookie

	err = session.Save(c.Request(), c.Response().Writer)

	if err != nil {
		log.Println("Error while saving a session", err)
	}

	return c.JSON(200, map[string]interface{}{
		"success": true,
		"user": map[string]interface{}{
			"id":    newUser.Id,
			"name":  newUser.Name,
			"email": newUser.Email,
		},
	})
}

func (ac AuthenticationController) HandleLogin(c echo.Context) error {

	// Check if user is already logged in
	if c.Get("IsLoggedIn").(bool) {
		return c.JSON(200, map[string]interface{}{"success": false, "error": "You are already logged in"})
	}

	username := c.FormValue("username")
	password := c.FormValue("password")

	// Validate the form first
	if isValid, errors := ac.validateLoginForm(username, password); !isValid {
		return c.JSON(200, map[string]interface{}{
			"success": false,
			"errors":  errors,
		})
	}

	// Get the user for e-mail address
	user, ok := manager.User.FindUserBy("username", username)

	// No user found for this username. Return an error
	if !ok {
		return c.JSON(200, map[string]interface{}{"success": false, "error": "Invalid credentials"})
	}

	// Compare passwords
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))

	if err != nil {
		return c.JSON(200, map[string]interface{}{"success": false, "error": "Invalid credentials"})
	}

	// Password is correct. Now we can safely create the session;
	session, err := manager.Session.Get(c.Request(), "SESSION_ID")
	if err != nil {
		// The session is incorrect. We should remove the cookie.
		cookie := http.Cookie{
			Name:   "SESSION_ID",
			Value:  "",
			MaxAge: -1,
		}
		c.SetCookie(&cookie)
		return c.JSON(200, map[string]interface{}{"success": false, "error": "An error occurred while logging in. Please try again"})
	}

	session.Values["SessionCookie"] = entities.SessionCookie{
		UserId: user.Id,
		Role:   "ADMIN", // @TODO: Replace this when roles are implemented
	}

	session.Save(c.Request(), c.Response().Writer)

	return c.JSON(200, map[string]interface{}{
		"success": true,
		"user": map[string]interface{}{
			"id":    user.Id,
			"name":  user.Name,
			"email": user.Email,
		},
	})
}

func (ac AuthenticationController) validateLoginForm(username string, password string) (bool, map[string]string) {

	errors := map[string]string{}
	isValid := true

	// First name validation
	if username == "" {
		errors["username"] = "Username cannot be empty"
		isValid = false
	}

	// Password validation
	if password == "" {
		errors["password"] = "Password cannot be empty"
		isValid = false
	}

	return isValid, errors

}
