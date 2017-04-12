package routes


import (
"github.com/iKonrad/typitap/server/api/controller"
"github.com/labstack/echo"
)

// API is a defined as struct bundle
// for api. Feel free to organize
// your app as you wish.
type APIRoutes struct{}

// Bind attaches api routes
func (api *APIRoutes) Bind(group *echo.Group) {
	// Authentication routes
	group.GET("/auth/check", controllers.AuthenticationC.TestHandler)
	group.POST("/auth/signup", controllers.AuthenticationC.HandleSignup)
	group.POST("/auth/login", controllers.AuthenticationC.HandleLogin)
	group.POST("/auth/logout", controllers.AuthenticationC.HandleLogout);
	group.POST("/auth/password/forgot", controllers.AuthenticationC.HandlePasswordForgot);
	group.POST("/auth/password/reset", controllers.AuthenticationC.HandlePasswordReset);
	group.POST("/auth/password/validate/:token", controllers.AuthenticationC.HandleValidatePasswordToken);
	group.POST("/auth/activate/:token", controllers.AuthenticationC.HandleActivate);
}


