package handlers;

import (
	"github.com/labstack/echo"
	"github.com/iKonrad/typitap/server/manager"
	"log"

)

type AuthenticationHandler struct {
}

var AuthenticationH AuthenticationHandler;

func init() {
	AuthenticationH = AuthenticationHandler{};
}

func (api *AuthenticationHandler) TestHandler(c echo.Context) error {
	return c.JSON(200, "{'error': 'Nice, it worked'}");
}






func (api *AuthenticationHandler) Signup(c echo.Context) error {

	// Get form data
	details := map[string]interface{}{
		"name": c.FormValue("name"),
		"email": c.FormValue("email"),
		"password": c.FormValue("password"),
		"username": c.FormValue("username"),
	};

	isValid, errors := manager.User.ValidateUser(details);

	if (!isValid) {
		response := map[string]interface{}{
			"success": false,
			"errors": errors,
		};
		return c.JSON(200, response);
	}



	_, err := manager.User.CreateUser(details);

	if (err != nil) {

	}
	return c.JSON(200, map[string]interface{}{"success": true})

	// Validate data
	// Create user
	// Save to database
	// Return token / save cookie

}









func (api *AuthenticationHandler) AuthTokenCheckHandler(c echo.Context) error {

	// @TODO: Restrict to localhost requests only

	//auth := authentication.Authentication
	cookie, err := c.Cookie("SESSION_ID");

	if (err != nil) {
		log.Println(err)
		return c.JSON(200, "{'error': 'No cookie present'}");
	}

	decodedvalue, err := manager.Cookie.DecodeCookie(cookie);

	if (err != nil) {
		log.Println(err)
		return c.JSON(200, "{'error': 'Issue while decoding a cookie'}");
	}

	userid, err := manager.Session.RetrieveToken(decodedvalue);

	if (err != nil) {
		log.Println(err)
		return c.JSON(200, "{'error': 'No session for that cookie'}");
	}

	return c.JSON(200, "{'error': 'Nice, token found, you're logged in"+ userid +"'}");


}
