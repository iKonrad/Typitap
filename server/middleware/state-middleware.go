package middleware

import (
	"github.com/iKonrad/typitap/server/entities"
	"github.com/iKonrad/typitap/server/services/feed"
	"github.com/iKonrad/typitap/server/services/levels"
	"github.com/labstack/echo"
	"strings"
	"time"
	"strconv"
	"github.com/iKonrad/typitap/server/services/websocket"
	"github.com/iKonrad/typitap/server/services/gametexts"
)

func GenerateStateHandler(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {

		if strings.HasPrefix(c.Request().RequestURI, "/api") || strings.HasPrefix(c.Request().RequestURI, "/static") || strings.HasPrefix(c.Request().RequestURI, "/userboards") {
			return next(c)
		}

		newStore := map[string]interface{}{}

		// Get the logged in user if exists
		if c.Get("IsLoggedIn").(bool) {
			user := c.Get("User").(entities.User)

			userFeed, _ := feed.GetUserFollow(user.Id)

			newStore["user"] = map[string]interface{}{
				"data": map[string]interface{}{
					"Id":        user.Id,
					"Username":  user.Username,
					"Name":      user.Name,
					"Active":    user.Active,
					"Created":   user.Created.Format(time.RFC3339),
					"Email":     user.Email,
					"Role":      user.Role,
					"Level":     user.Level,
					"Exp":       user.Exp,
					"Bio": user.Bio,
					"Country": user.Country,
					"Keyboard": user.Keyboard,
					"KeyboardLayout": strconv.Itoa(user.KeyboardLayout),
					"NextExp":   levels.CalculateThresholdForLevel(user.Level + 1),
					"LevelName": levels.GetLevelName(user.Level),
				},
				"follow":   userFeed,
				"loggedIn": true,
			}
		} else {
			newStore["user"] = map[string]interface{}{
				"data":     map[string]interface{}{},
				"loggedIn": false,
			}
		}

		newStore["app"] = map[string]interface{}{
			"onlineRoom": websocket.GetEngine().GetOnlineRoomData(),
			"languages": gametexts.GetActiveTextLanguages(),
		}

		c.Set("State", newStore)

		return next(c)
	}
}
