package main

import (
	"github.com/iKonrad/typitap/server/api/controller"
	"github.com/labstack/echo"
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
	group.POST("/auth/signup", controllers.AuthenticationC.HandleSignup)
	group.POST("/auth/login", controllers.AuthenticationC.HandleLogin)
	group.POST("/auth/logout", controllers.AuthenticationC.HandleLogout);
}

// ConfHandler handle the app config, for example
func (api *API) ConfHandler(c echo.Context) error {
	app := c.Get("app").(*App)
	return c.JSON(200, app.Conf.Root)
}
