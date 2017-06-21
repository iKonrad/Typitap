package routes

import (
	"github.com/iKonrad/typitap/server/controller"
	"github.com/labstack/echo"
)

// API is a defined as struct bundle
// for api. Feel free to organize
// your app as you wish.
type AuthenticationAPIRoutes struct{}

// Bind attaches api routes
func (api *AuthenticationAPIRoutes) Bind(group *echo.Group) {
	// Authentication routes
	group.POST("/signup", controller.AuthenticationAPI.HandleSignup)
	group.POST("/login", controller.AuthenticationAPI.HandleLogin)
	group.POST("/logout", controller.AuthenticationAPI.HandleLogout)
	group.POST("/password/forgot", controller.AuthenticationAPI.HandlePasswordForgot)
	group.POST("/password/reset", controller.AuthenticationAPI.HandlePasswordReset)

}
