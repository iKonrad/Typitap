package controller

import (
	"github.com/labstack/echo"
	"net/http"
)

type InternalAPIController struct{}

var InternalAPI InternalAPIController

func init() {
	InternalAPI = InternalAPIController{}
}

func (cc InternalAPIController) DoNotTrackMeAction(c echo.Context) error {
	trackCookie := http.Cookie{
		Name:  "TYPITAP_NOTRACK",
		Value:  "1",
		MaxAge: 365 * 60 * 60 * 24,
		HttpOnly: false,
		Path: "/",
		Domain: "https://typitap.com",
	}

	c.SetCookie(&trackCookie)

	return c.JSON(200, map[string]interface{}{
		"success": true,
		"message": "Cookie saved",
	})
}