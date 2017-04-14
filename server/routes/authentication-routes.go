package routes

import (
	"github.com/iKonrad/typitap/server/controller"
	"github.com/labstack/echo"
)

// API is a defined as struct bundle
// for api. Feel free to organize
// your app as you wish.
type AuthenticationRoutes struct{}

// Bind attaches api routes
func (ar *AuthenticationRoutes) Bind(group *echo.Group) {
	group.GET("/logout", controller.Authentication.HandleLogout);
	group.GET("/activate/:token", controller.Authentication.HandleActivate);
	group.GET("/password/reset/:token", controller.Authentication.HandleValidatePasswordToken)
}


