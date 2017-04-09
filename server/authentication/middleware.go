package authentication

import (

	//"github.com/gorilla/schema"
	//"github.com/gorilla/securecookie"
	//"github.com/gorilla/sessions"
	"github.com/labstack/echo"
	"fmt"
	//"net/http"
	"strings"
	"github.com/iKonrad/typitap/server/manager"
	r "gopkg.in/gorethink/gorethink.v3"
	"github.com/iKonrad/typitap/server/entities"
	db "github.com/iKonrad/typitap/server/database"
)


// Declare global variables




func CheckAuthHandler(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {

		// Ignore static file requests
		if (strings.HasPrefix(c.Request().URL.Path, "/static")) {
			return next(c);
		}

		session, err := manager.Session.Get(c.Request(), "SESSION_ID");

		if (err != nil) {
			fmt.Println("Error while fetching a session", err);
		}

		c.Set("User", entities.User{});
		c.Set("IsLoggedIn", false);

		// Get the user for the session
		if (!session.IsNew) {

			userId := session.Values["SessionCookie"].(*entities.SessionCookie).UserId;

			res, err := r.Table("users").Get(userId).Run(db.Session);

			if (err == nil) {
				var currentUser entities.User;
				err = res.One(&currentUser);
				if (err == nil) {
					c.Set("User", currentUser);
					c.Set("IsLoggedIn", true);
				}
			}
		}

		return next(c);
	}
}

