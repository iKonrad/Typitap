package middleware

import (
	"strings"
	"github.com/iKonrad/typitap/server/entities"
	"github.com/labstack/echo"
	"github.com/iKonrad/typitap/server/services/feed"
	"time"
)

func GenerateStateHandler(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {

		if strings.HasPrefix(c.Path(), "/api") || strings.HasPrefix(c.Path(), "/static") {
			return next(c)
		}

		newStore := map[string]interface{}{}

		// Get the logged in user if exists
		if c.Get("IsLoggedIn").(bool) {
			user := c.Get("User").(entities.User)

			userFeed, _ := feed.GetUserFollow(user.Id);

			newStore["user"] = map[string]interface{}{
				"data": map[string]interface{}{
					"Id": user.Id,
					"Username": user.Username,
					"Name": user.Name,
					"Active": user.Active,
					"Created": user.Created.Format(time.RFC3339),
					"Email": user.Email,
					"Role": user.Role,
				},
				"follow": userFeed,
				"loggedIn": true,
			}
		} else {
			newStore["user"] = map[string]interface{}{
				"data": map[string]interface{}{},
				"loggedIn": false,
			}
		}

		c.Set("State", newStore)

		return next(c)
	}
}
