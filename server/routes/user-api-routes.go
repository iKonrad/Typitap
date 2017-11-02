package routes

import (
	"github.com/iKonrad/typitap/server/controller"
	"github.com/labstack/echo"
)

// API is a defined as struct bundle
// for api. Feel free to organize
// your app as you wish.
type UserAPIRoutes struct{}

// Bind attaches api routes
func (api *UserAPIRoutes) Bind(group *echo.Group) {
	// Authentication routes
	group.GET("/results", controller.UserAPI.GetUserGameResults)
	group.POST("/account/update", controller.UserAPI.UpdateAccountInformation)
	group.GET("/feed", controller.UserAPI.GetUserActivityFeed)
	group.GET("/stats", controller.UserAPI.GetUserStats)
	group.POST("/follow/:followUser", controller.UserAPI.FollowUser)
	group.POST("/unfollow/:followUser", controller.UserAPI.UnfollowUser)
	group.GET("/profile/:user", controller.UserAPI.GetUserProfileData)
	group.GET("/followers", controller.UserAPI.GetUserFollow)
	group.POST("/account/resend", controller.UserAPI.ResendActivationLink)
	group.GET("/search/:query", controller.UserAPI.HandleUserSearch)
	group.POST("/texts", controller.UserAPI.SubmitText)

}
