package routes

import (
	"github.com/iKonrad/typitap/server/controller"
	"github.com/labstack/echo"
)

// API is a defined as struct bundle
// for api. Feel free to organize
// your app as you wish.
type InternalAPIRoutes struct{}

// Bind attaches api routes
func (api *InternalAPIRoutes) Bind(group *echo.Group) {
	// Authentication routes
	group.GET("/notrack", controller.InternalAPI.DoNotTrackMeAction)
}
