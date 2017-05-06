package routes


import (
	"github.com/iKonrad/typitap/server/controller"
	"github.com/labstack/echo"
)

// API is a defined as struct bundle
// for api. Feel free to organize
// your app as you wish.
type GameAPIRoutes struct{}

// Bind attaches api routes
func (api *GameAPIRoutes) Bind(group *echo.Group) {
	// Authentication routes
	group.GET("/session/:type", controller.GameAPI.GetSession)
	group.POST("/session/result", controller.GameAPI.SaveResult)
}
