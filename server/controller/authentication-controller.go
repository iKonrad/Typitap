package controller

import (
	"github.com/iKonrad/typitap/server/manager"
	"github.com/labstack/echo"
	"log"
	"github.com/iKonrad/typitap/server/middleware"
)

type AuthenticationController struct {
}

var Authentication AuthenticationController

func init() {
	Authentication = AuthenticationController{}
}

func (ac AuthenticationController) HandleActivate(c echo.Context) error {

	token := c.Param("token");
	userToken, ok := manager.User.GetUserToken(token, "activate");
	if !ok {
		c.Set("Response", map[string]interface{}{
			"success": false,
			"error":   "Token not found or has already been used",
		});
		return middleware.ReactJS.Handle(c);
	}

	// Activate the user
	activated := manager.User.ActivateUser(userToken.User.Id);

	// Mark the token as used
	manager.User.UseUserToken(userToken.Token, "activate");
	c.Set("Response", map[string]interface{}{
		"success": activated,
		"error":   "Token not found or has already been used",
	});

	return middleware.ReactJS.Handle(c);
}

func (ac AuthenticationController) HandleLogout(c echo.Context) error {

	// Check if user is already logged in
	if !c.Get("IsLoggedIn").(bool) {
		c.Set("Response", map[string]interface{}{
			"success": true,
		});
		return middleware.ReactJS.Handle(c);
	}

	session, err := manager.Session.Get(c.Request(), "SESSION_ID");
	if err != nil {
		log.Println("Error while fetching the session", err);
	}

	session.Options.MaxAge = -1;
	session.Save(c.Request(), c.Response().Writer);
	c.Set("Response", map[string]interface{}{
		"success": true,
	});
	return middleware.ReactJS.Handle(c);
}

func (ac AuthenticationController) HandleValidatePasswordToken(c echo.Context) error {

	tokenString := c.Param("token");
	_, ok := manager.User.GetUserToken(tokenString, "password");
	c.Set("Response", map[string]interface{}{
		"success": true,
		"valid":   ok,
	});
	return middleware.ReactJS.Handle(c);
}
