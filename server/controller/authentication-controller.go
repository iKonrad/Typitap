package controller

import (
	"log"

	"github.com/iKonrad/typitap/server/middleware"
	"github.com/iKonrad/typitap/server/services/sessions"
	us "github.com/iKonrad/typitap/server/services/user"
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
	userToken, ok := us.GetUserToken(token, us.TOKEN_ACTIVATE)
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
	us.UseUserToken(userToken.Token, us.TOKEN_ACTIVATE)
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
	_, ok := us.GetUserToken(tokenString, us.TOKEN_PASSWORD_CHANGE)
	c.Set("Response", map[string]interface{}{
		"success": true,
		"valid":   ok,
	})
	return middleware.ReactJS.Handle(c)
}


func (ac AuthenticationController) HandleEmailChangeToken(c echo.Context) error {
	tokenString := c.Param("token")
	token, ok := us.GetUserToken(tokenString, us.TOKEN_CHANGE_EMAIL)
	var updated bool
	if ok && token.Value != "" {
		token.User.Email = token.Value
		updated = us.UpdateUser(&token.User)
	}

	c.Set("Response", map[string]interface{}{
		"success": updated,
		"valid":   ok,
	})
	return middleware.ReactJS.Handle(c)
}