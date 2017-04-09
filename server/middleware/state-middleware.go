package middleware

import (
	"strings"
	"github.com/iKonrad/typitap/server/entities"
	"github.com/labstack/echo"
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
			newStore["user"] = map[string]interface{}{
				"loggedIn": true,
				"id":       user.Id,
				"email":    user.Email,
				"active":   user.Active,
				"username": user.Username,
				"name":     user.Name,
			}
		} else {
			newStore["user"] = map[string]interface{}{
				"loggedIn": false,
			}
		}

		c.Set("State", newStore)

		return next(c)
	}
}
