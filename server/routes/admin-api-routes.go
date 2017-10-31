package routes

import (
	"github.com/iKonrad/typitap/server/controller"
	"github.com/labstack/echo"
)

type UserAPIAdminRoutes struct{}

// Bind attaches api routes
func (api *UserAPIAdminRoutes) Bind(group *echo.Group) {
	// Authentication routes
	group.GET("/users", controller.AdminAPI.GetUsers)
	group.POST("/update", controller.AdminAPI.UpdateTableField)
	group.GET("/levels", controller.AdminAPI.GetLevels)
	group.GET("/texts/:id", controller.AdminAPI.GetText)
	group.POST("/texts/:id", controller.AdminAPI.SaveText)
	group.POST("/texts", controller.AdminAPI.SaveText)
	group.GET("/texts", controller.AdminAPI.GetTexts)
}
