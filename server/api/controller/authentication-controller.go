package controllers

import (
	"github.com/iKonrad/typitap/server/entities"
	"github.com/iKonrad/typitap/server/manager"
	"github.com/labstack/echo"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
	"github.com/iKonrad/typitap/server/config"
)

type AuthenticationController struct {
}

var AuthenticationC AuthenticationController

func init() {
	AuthenticationC = AuthenticationController{}
}

func (ac *AuthenticationController) TestHandler(c echo.Context) error {
	return c.JSON(200, "{'error': 'Nice, it worked'}")
}

func (ac *AuthenticationController) HandleSignup(c echo.Context) error {

	// Check if user is logged in first
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


	// Generate an activation token for the confirmation e-mail
	token, ok := manager.User.GenerateUserToken("activate", newUser);

	if !ok {

		return c.JSON(500, map[string]interface{}{
			"success": false,
			"error": "Your account has been created, but there was a problem with your activation token. Please get in touch with us for more information",
		});
	}

	// Send confirmation e-mail with an activation link
	emailTags := map[string]interface{}{
		"name": newUser.Name,
		"action_url": "http://" + c.Request().Host + "/activate/" + token,
		"username": newUser.Username,
	};

	manager.Mail.SendEmail(newUser.Email, "NEW_ACCOUNT", emailTags)

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

	// Create user data for the session
	sessionCookie := entities.SessionCookie{
		UserId: newUser.Id,
		Role:   "ADMIN", // @TODO: Replace this when roles are implemented
	}

	session.Values["SessionCookie"] = sessionCookie

	session.Options.MaxAge = 60 * 60 * 24 * 14;
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

	session.Options.MaxAge = 60 * 60 * 24 * 14;

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


func (ac AuthenticationController) HandleLogout (c echo.Context) error {

	// Check if user is already logged in
	if !c.Get("IsLoggedIn").(bool) {
		return c.JSON(200, map[string]interface{}{"success": true})
	}

	session, err := manager.Session.Get(c.Request(), "SESSION_ID");

	if err != nil {
		log.Println("Error while fetching the session", err);
	}

	config.Get("LOL");

	session.Options.MaxAge = -1;
	session.Save(c.Request(), c.Response().Writer);

	return c.JSON(200, map[string]interface{}{"success": true});

}


func (ac AuthenticationController) HandleActivate(c echo.Context) error {

	// Check if user is logged in
	if c.Get("IsLoggedIn").(bool) {
		return c.JSON(202, map[string]interface{}{
			"success": false,
			"message": "You are logged in",
		});
	}


	token := c.Param("token");

	userToken, ok := manager.User.GetUserToken(token, "activate");

	if !ok {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"success": false,
			"message": "Token not found or has already been used",
		});
	}

	// Activate the user
	activated := manager.User.ActivateUser(userToken.User.Id);

	// Mark the token as used
	manager.User.UseUserToken(userToken.Token, "activate");

	return c.JSON(200, map[string]interface{}{
		"success": activated,
	})

}


func (ac AuthenticationController) HandlePasswordForgot(c echo.Context) error {

	// Check if logged in
	if (c.Get("IsLoggedIn").(bool)) {
		return c.JSON(http.StatusMethodNotAllowed, map[string]interface{}{
			"success": false,
			"errors": map[string]string {
				"_error": "You are logged in",
			},
		});
	}

	emailAddress := c.FormValue("email");

	// Check if user exists for this e-mail

	user, ok := manager.User.FindUserBy("email", emailAddress);

	if !ok {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"success": false,
			"errors": map[string]string{
				"email": "We couldn't find an account for this e-mail address",
			},
		});
	}

	// Create a userToken for that user
	userToken, ok := manager.User.GenerateUserToken("password", user);

	if (!ok) {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"errors": map[string]string {
				"_error": "An error occured while generating your token. Please try again later",
			},
		});
	}

	// Send the token to the e-mail address
	emailTags := map[string]interface{}{
		"name": user.Name,
		"action_url": "http://" + c.Request().Host + "/password/reset/" + userToken,
		"username": user.Username,
	};

	manager.Mail.SendEmail(user.Email, "PASSWORD_RESET", emailTags);

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
	});

}


func (ac AuthenticationController) HandlePasswordReset(c echo.Context) error {

	// Check if logged in
	if (c.Get("IsLoggedIn").(bool)) {
		return c.JSON(http.StatusMethodNotAllowed, map[string]interface{}{
			"success": false,
			"errors": map[string]string {
				"_error": "You are logged in",
			},
		});
	}

	tokenString := c.FormValue("token");
	password := c.FormValue("password");
	passwordConfirm := c.FormValue("password-confirm");

	userToken, ok := manager.User.GetUserToken(tokenString, "password");

	if !ok {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"success": false,
			"errors": map[string]string{
				"_error": "Token is invalid or expired. Please try requesting a password reset again",
			},
		});
	}

	// We've got the token, now we can validate the password
	isPasswordValid, _ := manager.User.ValidatePassword(password);

	if !isPasswordValid {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"success": false,
			"errors": map[string]string{
				"password": "Invalid Password",
			},
		});
	}

	if password != passwordConfirm {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"success": false,
			"errors": map[string]string{
				"password-confirm": "Passwords do not match",
			},
		});
	}


	// Otherwise we can update the password
	isUpdated := manager.User.UpdateUserPassword(password, userToken.User);

	if !isUpdated {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"errors": map[string]string{
				"password": "There was an issue with updating your password. Please try again later",
			},
		});
	}


	// Now we can mark the token as used
	manager.User.UseUserToken(userToken.Token, "password");

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
	});

}


func (ac AuthenticationController) HandleValidatePasswordToken(c echo.Context) error {

	tokenString := c.Param("token");

	_, ok := manager.User.GetUserToken(tokenString, "password");

	return c.JSON(200, map[string]interface{}{
		"success": true,
		"valid": ok,
	});

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


