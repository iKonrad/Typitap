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
