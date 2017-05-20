package controller

import (
	"log"

	"github.com/iKonrad/typitap/server/middleware"
	us "github.com/iKonrad/typitap/server/services/user"
	"github.com/iKonrad/typitap/server/services/sessions"
	"github.com/labstack/echo"
)

type AuthenticationController struct {
}

var Authentication AuthenticationController

func init() {
	Authentication = AuthenticationController{}
}

func (ac AuthenticationController) HandleActivate(c echo.Context) error {

	token := c.Param("token")
	userToken, ok := us.GetUserToken(token, "activate")
	if !ok {
		c.Set("Response", map[string]interface{}{
			"success": false,
			"error":   "Token not found or has already been used",
		})
		return middleware.ReactJS.Handle(c)
	}

	// Activate the user
	activated := us.ActivateUser(userToken.User.Id)

	// Mark the token as used
	us.UseUserToken(userToken.Token, "activate")
	c.Set("Response", map[string]interface{}{
		"success": activated,
		"error":   "Token not found or has already been used",
	})
	return middleware.ReactJS.Handle(c)
}

func (ac AuthenticationController) HandleLogout(c echo.Context) error {

	// Check if user is already logged in
	if !c.Get("IsLoggedIn").(bool) {
		c.Set("Response", map[string]interface{}{
			"success": true,
		})
		return middleware.ReactJS.Handle(c)
	}

	session, err := sessions.Session.Get(c.Request(), "SESSION_ID")
	if err != nil {
		log.Println("Error while fetching the session", err)
	}

	session.Options.MaxAge = -1
	session.Save(c.Request(), c.Response().Writer)
	c.Set("Response", map[string]interface{}{
		"success": true,
	})
	return middleware.ReactJS.Handle(c)
}

func (ac AuthenticationController) HandleValidatePasswordToken(c echo.Context) error {

	tokenString := c.Param("token")
	_, ok := us.GetUserToken(tokenString, "password")
	c.Set("Response", map[string]interface{}{
		"success": true,
		"valid":   ok,
	})
	return middleware.ReactJS.Handle(c)
}
