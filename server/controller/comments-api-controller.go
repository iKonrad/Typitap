package controller

import (
	"net/http"

	"github.com/iKonrad/typitap/server/services/comments"
	"github.com/labstack/echo"
	"github.com/iKonrad/typitap/server/entities"
)

type CommentsAPIController struct{}

var CommentsAPI CommentsAPIController

func init() {
	CommentsAPI = CommentsAPIController{}
}

/*
	Returns comments for a given channel ID
	Usage: /api/comments/[id]
*/
func (cc CommentsAPIController) GetComments(c echo.Context) error {

	channelId := c.Param("channelId")

	channelComments, ok := comments.GetComments(channelId)

	if !ok {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"success": false,
			"data":    []map[string]interface{}{},
			"message": "Unable to fetch comments for this channel",
		})
	}

	return c.JSON(200, map[string]interface{}{
		"success": true,
		"data":    channelComments,
	})

}

/*
	Saves a comment into the database
 */
func (cc CommentsAPIController) AddComment(c echo.Context) error {

	if !c.Get("IsLoggedIn").(bool) {
		return c.JSON(http.StatusUnauthorized, map[string]interface{}{
				"success": false,
				"message": "You are not logged in",
		})
	}

	channelId := c.FormValue("channelId")
	text := c.FormValue("text")

	if text == "" {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"success": false,
			"message": "Empty comment",
		})
	}

	u := c.Get("User").(entities.User)

	if channelId == "" {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"success": false,
			"message": "Invalid channel ID or user",
		})
	}

	saved := comments.AddComment(channelId, u, text)

	if !saved {
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"message": "Error while saving comment",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
			"success": true,
			"message": "Comment saved",
	})

}
