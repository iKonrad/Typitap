package middleware

import (
	"github.com/iKonrad/typitap/server/entities"
	"github.com/labstack/echo"
	"github.com/iKonrad/typitap/server/services/roles"
	"net/http"
)

// Declare global variables

func CheckRoleHandler(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		//Check if user is logged in
		userRole := "ROLE_GUEST"
		loggedIn := c.Get("IsLoggedIn")
		if loggedIn != nil && loggedIn.(bool) {

			user := c.Get("User").(entities.User)
			if user.Role == "" {
				userRole = "ROLE_USER"
			} else {
				userRole = user.Role
			}

		}

		url := c.Request().RequestURI

		canAccess := roles.CanRoleAccessURL(userRole, url);
		if canAccess {
			return next(c)
		}

		return c.Redirect(http.StatusTemporaryRedirect, "/login")

	}
}
