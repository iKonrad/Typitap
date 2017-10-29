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
	group.GET("/session/:type/:language", controller.GameAPI.GetSession)
	group.POST("/session/result", controller.GameAPI.SaveResult)
	group.GET("/charts", controller.GameAPI.GetChartsData)
	group.GET("/charts/:name", controller.GameAPI.GetChartData)
	group.GET("/feed", controller.GameAPI.GetGlobalFeed)
	group.GET("/result/:id", controller.GameAPI.GetResultsData)
	group.GET("/playbacks/:id", controller.GameAPI.GetPlaybackData)
}
