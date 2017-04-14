package routes


import (
"github.com/iKonrad/typitap/server/controller"
"github.com/labstack/echo"
)

// API is a defined as struct bundle
// for api. Feel free to organize
// your app as you wish.
type APIRoutes struct{}

// Bind attaches api routes
func (api *APIRoutes) Bind(group *echo.Group) {
	// Authentication routes
	group.GET("/auth/check", controller.AuthenticationAPI.TestHandler)
	group.POST("/auth/signup", controller.AuthenticationAPI.HandleSignup)
	group.POST("/auth/login", controller.AuthenticationAPI.HandleLogin)
	group.POST("/auth/logout", controller.AuthenticationAPI.HandleLogout);
	group.POST("/auth/password/forgot", controller.AuthenticationAPI.HandlePasswordForgot);
	group.POST("/auth/password/reset", controller.AuthenticationAPI.HandlePasswordReset);

}


