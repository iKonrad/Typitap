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
}
