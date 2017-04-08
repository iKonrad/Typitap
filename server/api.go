package main

import (
	"github.com/labstack/echo"
	"github.com/iKonrad/typitap/server/api/controller"
)

// API is a defined as struct bundle
// for api. Feel free to organize
// your app as you wish.
type API struct{}

// Bind attaches api routes
func (api *API) Bind(group *echo.Group) {
	group.GET("/v1/conf", api.ConfHandler)

	// Authentication routes
	group.GET("/auth/check", controllers.AuthenticationC.TestHandler)
	group.POST("/auth/signup", controllers.AuthenticationC.Signup)

}

// ConfHandler handle the app config, for example
func (api *API) ConfHandler(c echo.Context) error {
	app := c.Get("app").(*App)
	return c.JSON(200, app.Conf.Root)
}

