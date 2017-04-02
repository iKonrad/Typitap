package main

import (
	"github.com/labstack/echo"

	"log"
)

// API is a defined as struct bundle
// for api. Feel free to organize
// your app as you wish.
type API struct{}

// Bind attaches api routes
func (api *API) Bind(group *echo.Group) {
	group.GET("/v1/conf", api.ConfHandler)
	group.GET("/v1/auth/check", api.AuthTokenCheckHandler)

}

// ConfHandler handle the app config, for example
func (api *API) ConfHandler(c echo.Context) error {
	app := c.Get("app").(*App)
	return c.JSON(200, app.Conf.Root)
}



func (api *API) AuthTokenCheckHandler(c echo.Context) error {

	// @TODO: Restrict to localhost requests only

	app := c.Get("app").(*App);
	auth := app.Auth;
	cookie, err := c.Cookie("SESSION_ID");

	if (err != nil) {
		log.Println(err)
		return c.JSON(200, "{'error': 'No cookie present'}");
	}

	decodedvalue, err := auth.CookieManager.DecodeCookie(cookie);

	if (err != nil) {
		log.Println(err)
		return c.JSON(200, "{'error': 'Issue while decoding a cookie'}");
	}

	userid, err := auth.SessionManager.RetrieveToken(decodedvalue);

	if (err != nil) {
		log.Println(err)
		return c.JSON(200, "{'error': 'No session for that cookie'}");
	}

	return c.JSON(200, "{'error': 'Nice, token found, you're logged in"+ userid +"'}");


}
