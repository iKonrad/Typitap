package routes

import (
	"github.com/iKonrad/typitap/server/controller"
	"github.com/labstack/echo"
)

type CommentsAPIRoutes struct{}


func (api *CommentsAPIRoutes) Bind(group *echo.Group) {
	group.GET("/:channelId", controller.CommentsAPI.GetComments)
	group.POST("/", controller.CommentsAPI.AddComment)
}