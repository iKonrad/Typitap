package routes

import (
	"github.com/iKonrad/typitap/server/controller"
	"github.com/labstack/echo"
)

// API is a defined as struct bundle
// for api. Feel free to organize
// your app as you wish.
type AffiliatesAPIRoutes struct{}

// Bind attaches api routes
func (api *AffiliatesAPIRoutes) Bind(group *echo.Group) {
	// Authentication routes
	group.GET("/product/text/:id", controller.AffiliatesAPI.GetAmazonProductForText)
}
