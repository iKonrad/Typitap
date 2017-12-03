package middleware

import (
	"net/http"
	"strings"

	"github.com/iKonrad/typitap/server/entities"
	"github.com/iKonrad/typitap/server/services/roles"
	"github.com/labstack/echo"
)

// Declare global variables

func CheckRoleHandler(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		//Check if user is logged in
		userRole := "ROLE_GUEST"
		loggedIn := c.Get("IsLoggedIn")
		var user entities.User
		if loggedIn != nil && loggedIn.(bool) {
			user = c.Get("User").(entities.User)
			if user.Role == "" {
				userRole = "ROLE_USER"
			} else {
				userRole = user.Role
			}

		}

		url := c.Request().RequestURI
		canAccess := roles.CanRoleAccessURL(userRole, url)
		if canAccess {

			if strings.HasPrefix(url, "/u/") {
				// If user doesn't exist, show a 404 page
				username := strings.Replace(url, "/u/", "", 1)
				if username == "" {
					return c.Redirect(http.StatusMovedPermanently, "/404")
				}

				// If user is trying to view their own profile, redirect back to the dashboard

				if loggedIn.(bool) {
					if user.Username == username {
						return c.Redirect(http.StatusMovedPermanently, "/dashboard")
					}
				}
			}

			return next(c)
		}

		if strings.HasPrefix(url, "/api") {
			return c.JSON(http.StatusUnauthorized, map[string]interface{}{
				"success": false,
			})
		}

		return c.Redirect(http.StatusTemporaryRedirect, "/404")
	}
}
