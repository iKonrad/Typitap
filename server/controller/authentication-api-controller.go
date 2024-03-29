package controller

import (
	"log"
	"net/http"

	flarum "github.com/iKonrad/go-flarum"
	"github.com/iKonrad/typitap/server/config"
	"github.com/iKonrad/typitap/server/entities"
	"github.com/iKonrad/typitap/server/services/levels"
	"github.com/iKonrad/typitap/server/services/mail"
	"github.com/iKonrad/typitap/server/services/sessions"
	us "github.com/iKonrad/typitap/server/services/user"
	"github.com/iKonrad/typitap/server/services/utils"
	"github.com/labstack/echo"
	"golang.org/x/crypto/bcrypt"
	"github.com/iKonrad/typitap/server/services/logs"
)

type AuthenticationAPIController struct {
}

var AuthenticationAPI AuthenticationAPIController
var flarumClient *flarum.FlarumClient

func init() {
	AuthenticationAPI = AuthenticationAPIController{}
	flarumClient = flarum.NewClient(
		config.Config.UString("forum.url"),
		config.Config.UString("forum.token"),
		config.Config.UInt("cookie.expires"),
	)
}

func (ac *AuthenticationAPIController) HandleSignup(c echo.Context) error {

	// Check if user is logged in first
	if c.Get("IsLoggedIn").(bool) {
		return c.JSON(200, map[string]interface{}{"success": false, "error": "You are logged in"})
	}

	// Get country code
	country, ok := us.GetCountryCodeByIP(utils.GetIPAdress(c.Request()))

	// Get form data
	details := map[string]interface{}{
		"name":     c.FormValue("name"),
		"email":    c.FormValue("email"),
		"password": c.FormValue("password"),
		"username": c.FormValue("username"),
		"country":  country,
	}

	// Validate user details
	isValid, errors := us.ValidateUser(details)

	if !isValid {
		response := map[string]interface{}{
			"success": false,
			"errors":  errors,
		}
		return c.JSON(200, response)
	}

	// Data is valid, so we can create a new user now
	nu, err := us.CreateUser(details)
	newUser := us.ConvertUserToMap(&nu)
	if err != nil {
		log.Println(err)
	}

	newUser["Password"] = ""
	newUser["LevelName"] = levels.GetLevelName(int(newUser["Level"].(float64)))

	// Generate an activation token for the confirmation e-mail
	token, ok := us.GenerateUserToken("activate", nu, "")

	if !ok {
		return c.JSON(500, map[string]interface{}{
			"success": false,
			"error":   "Your account has been created, but there was a problem with your activation token. Please get in touch with us for more information",
		})
	}

	flarumClient.SignUp(nu.Username, nu.Email, details["password"].(string))

	// Send confirmation e-mail with an activation link
	link := "http://" + c.Request().Host + "/auth/activate/" + token
	mail.SendEmail(newUser["Email"].(string), mail.TEMPLATE_NEW_ACCOUNT, mail.TemplateButtonLink(
		newUser["Name"].(string),
		newUser["Username"].(string),
		link,
	))

	// Send push notification
	logs.PushUrl("New user", "New user '"+ newUser["Username"].(string) +"' registered.", "https://typitap.com/u/" + newUser["Username"].(string))

	// Now, that we have a user, we can log in automatically
	session, err := sessions.Session.Get(c.Request(), "SESSION_ID")
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

	// Create user data for the session
	sessionCookie := entities.SessionCookie{
		UserId: newUser["Id"].(string),
		Role:   "ROLE_USER", // @TODO: Replace this when roles are implemented
	}

	session.Values["SessionCookie"] = sessionCookie

	session.Options.MaxAge = 60 * 60 * 24 * 14
	err = session.Save(c.Request(), c.Response().Writer)

	forumToken, userId, forumErr := flarumClient.LogIn(details["username"].(string), details["password"].(string))

	if forumErr == nil {
		log.Println("USRID", userId)
		eee :=flarumClient.DeactivateUser(userId)
		log.Println("EEEEE", eee)
		forumCookie := http.Cookie{
			Name:   flarum.COOKIE_REMEMBER_ME,
			Value:  forumToken,
			MaxAge: config.Config.UInt("cookies.expires") * flarum.DAYS_MULTIPLIER,
			HttpOnly: false,
			Path: "/",
			Domain: config.Config.UString("forum.url"),
		}
		c.SetCookie(&forumCookie)
	}

	if err != nil {
		log.Println("Error while saving a session", err)
	}

	return c.JSON(200, map[string]interface{}{
		"success": true,
		"user":    newUser,
	})
}

func (ac AuthenticationAPIController) HandleLogin(c echo.Context) error {

	// Check if user is already logged in
	if c.Get("IsLoggedIn").(bool) {
		return c.JSON(200, map[string]interface{}{"success": false, "error": "You are already logged in"})
	}

	username := c.FormValue("username")
	password := c.FormValue("password")

	var err error

	// Validate the form first
	if isValid, errors := ac.validateLoginForm(username, password); !isValid {
		return c.JSON(200, map[string]interface{}{
			"success": false,
			"errors":  errors,
		})
	}

	// Get the user for e-mail address
	u, ok := us.FindUserBy("username", username)

	user := us.ConvertUserToMap(&u)

	// No user found for this username. Return an error
	if !ok {
		return c.JSON(200, map[string]interface{}{"success": false, "error": "Invalid credentials"})
	}

	// Compare passwords
	err = bcrypt.CompareHashAndPassword([]byte(user["Password"].(string)), []byte(password))

	if err != nil {
		return c.JSON(200, map[string]interface{}{"success": false, "error": "Invalid credentials"})
	}

	// Password is correct. Now we can safely create the session;
	session, err := sessions.Session.Get(c.Request(), "SESSION_ID")
	if err != nil {
		// The session is incorrect. We should remove the cookie.
		cookie := http.Cookie{
			Name:   "SESSION_ID",
			Value:  "",
			MaxAge: -1,
			Domain: ".typitap.com",
		}
		c.SetCookie(&cookie)
		return c.JSON(200, map[string]interface{}{"success": false, "error": "An error occurred while logging in. Please try again"})
	}

	session.Values["SessionCookie"] = entities.SessionCookie{
		UserId: user["Id"].(string),
		Role:   "ADMIN", // @TODO: Replace this when roles are implemented
	}

	session.Options.MaxAge = 60 * 60 * 24 * config.Config.UInt("cookie.expires", 14)

	user["Password"] = ""
	user["LevelName"] = levels.GetLevelName(int(user["Level"].(float64)))

	session.Save(c.Request(), c.Response().Writer)

	forumToken, _, forumErr := flarumClient.LogIn(username, password)

	if forumErr == nil {
		forumCookie := http.Cookie{
			Name:   flarum.COOKIE_REMEMBER_ME,
			Value:  forumToken,
			MaxAge: config.Config.UInt("cookies.expires") * flarum.DAYS_MULTIPLIER,
			HttpOnly: false,
			Path: "/",
			Domain: ".typitap.com",
		}
		c.SetCookie(&forumCookie)
	}

	return c.JSON(200, map[string]interface{}{
		"success": true,
		"user":    user,
	})
}

func (ac AuthenticationAPIController) HandleLogout(c echo.Context) error {

	// Check if user is already logged in
	if !c.Get("IsLoggedIn").(bool) {
		return c.JSON(200, map[string]interface{}{"success": true})
	}

	session, err := sessions.Session.Get(c.Request(), "SESSION_ID")

	if err != nil {
		log.Println("Error while fetching the session", err)
	}

	log.Println("USER", c.Get("User").(entities.User))

	session.Options.MaxAge = -1
	session.Save(c.Request(), c.Response().Writer)

	// Reset forum cookie
	forumCookie := http.Cookie{
		Name:   flarum.COOKIE_REMEMBER_ME,
		Value:  "",
		MaxAge: -1,
		HttpOnly: false,
		Path: "/",
		Domain: ".typitap.com",
	}
	c.SetCookie(&forumCookie)

	// Reset forum cookie
	forumCookie = http.Cookie{
		Name:   flarum.COOKIE_SESSION,
		Value:  "",
		MaxAge: -1,
		HttpOnly: false,
		Path: "/",
		Domain: ".typitap.com",
	}
	c.SetCookie(&forumCookie)

	return c.JSON(200, map[string]interface{}{"success": true})

}

func (ac AuthenticationAPIController) HandlePasswordForgot(c echo.Context) error {

	// Check if logged in
	if c.Get("IsLoggedIn").(bool) {
		return c.JSON(http.StatusMethodNotAllowed, map[string]interface{}{
			"success": false,
			"errors": map[string]string{
				"_error": "You are logged in",
			},
		})
	}

	emailAddress := c.FormValue("email")

	// Check if user exists for this e-mail

	user, ok := us.FindUserBy("email", emailAddress)

	if !ok {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"success": false,
			"errors": map[string]string{
				"email": "We couldn't find an account for this e-mail address",
			},
		})
	}

	// Create a userToken for that user
	userToken, ok := us.GenerateUserToken("password", user, "")

	if !ok {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"errors": map[string]string{
				"_error": "An error occured while generating your token. Please try again later",
			},
		})
	}

	// Send the token to the e-mail address
	link := "http://" + c.Request().Host + "/auth/password/reset/" + userToken
	mail.SendEmail(user.Email, mail.TEMPLATE_PASSWORD_RESET, mail.TemplateButtonLink(user.Name, user.Username, link))

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
	})

}

func (ac AuthenticationAPIController) HandlePasswordReset(c echo.Context) error {

	// Check if logged in
	if c.Get("IsLoggedIn").(bool) {
		return c.JSON(http.StatusMethodNotAllowed, map[string]interface{}{
			"success": false,
			"errors": map[string]string{
				"_error": "You are logged in",
			},
		})
	}

	tokenString := c.FormValue("token")
	password := c.FormValue("password")
	passwordConfirm := c.FormValue("password-confirm")

	userToken, ok := us.GetUserToken(tokenString, "password")

	if !ok {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"success": false,
			"errors": map[string]string{
				"_error": "Token is invalid or expired. Please try requesting a password reset again",
			},
		})
	}

	// We've got the token, now we can validate the password
	isPasswordValid, err := us.ValidatePassword(password)

	if !isPasswordValid {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"success": false,
			"errors": map[string]string{
				"password": err,
			},
		})
	}

	if password != passwordConfirm {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"success": false,
			"errors": map[string]string{
				"password-confirm": "Passwords do not match",
			},
		})
	}

	// Otherwise we can update the password
	isUpdated := us.UpdateUserPassword(password, userToken.User)

	if !isUpdated {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"errors": map[string]string{
				"password": "There was an issue with updating your password. Please try again later",
			},
		})
	}

	// Update password in forum as well
	forumUser, forumError := flarumClient.GetUserByUsername(userToken.User.Username)
	forumUserData, ok := forumUser["data"].([]interface {})
	if forumError == nil && ok && len(forumUserData) > 0 {
		if forumUserId, ok := forumUserData[0].(map[string]interface{})["id"]; ok {
			flarumClient.UpdateUserAttribute(forumUserId.(string), "password", password)
		}
	} else {
		// There's no user in flarum. Let's create one.
		// We'll use password reset as a fallback to create forum users
		flarumClient.SignUp(userToken.User.Username, userToken.User.Email, password)
	}

	// Now we can mark the token as used
	us.UseUserToken(userToken.Token, "password")
	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
	})
}

func (ac AuthenticationAPIController) validateLoginForm(username string, password string) (bool, map[string]string) {

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
