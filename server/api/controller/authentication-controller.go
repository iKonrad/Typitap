package controllers;

import (
	"github.com/labstack/echo"
	"github.com/iKonrad/typitap/server/manager"
	"log"
	"github.com/iKonrad/typitap/server/entities"
)

type AuthenticationController struct {
}

var AuthenticationC AuthenticationController;

func init() {
	AuthenticationC = AuthenticationController{};
}

func (api *AuthenticationController) TestHandler(c echo.Context) error {
	return c.JSON(200, "{'error': 'Nice, it worked'}");
}




func (api *AuthenticationController) Signup(c echo.Context) error {

	// @TODO: Check if user is logged in first



	// Get form data
	details := map[string]interface{}{
		"name": c.FormValue("name"),
		"email": c.FormValue("email"),
		"password": c.FormValue("password"),
		"username": c.FormValue("username"),
	};

	// Validate user details
	isValid, errors := manager.User.ValidateUser(details);

	if (!isValid) {
		response := map[string]interface{}{
			"success": false,
			"errors": errors,
		};
		return c.JSON(200, response);
	}

	// Data is valid, so we can create a new user now
	newUser, err := manager.User.CreateUser(details);

	if (err != nil) {
		log.Println(err);
	}

	// Now, that we have a user, we can log in automatically

	session, err := manager.Rethink.Get(c.Request(), "SESSION_ID");
	if (err != nil) {
		log.Println("Error when generating a session", err);
	}

	if (!session.IsNew) {
		return c.JSON(200, map[string]interface{}{"success": false, "error": "You are logged in"})
	}

	sessionCookie := entities.SessionCookie{
		UserId: newUser.Id,
		Role: "ADMIN",
	};

	session.Values["SessionCookie"] = sessionCookie;

	err = session.Save(c.Request(), c.Response().Writer);

	if (err != nil) {
		log.Println("Error while saving a session", err);
	}

	return c.JSON(200, map[string]interface{}{"success": true})
}