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
)


// Declare global variables




func CheckAuthHandler(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {

		// Ignore static file requests
		if (strings.HasPrefix(c.Request().URL.Path, "/static")) {
			return next(c);
		}


		// For debug
		fmt.Println("Cookies for path: " + c.Request().URL.Path);
		for _, cookie := range c.Cookies() {
			fmt.Print("Name: ");
			fmt.Println(cookie.Name)
			fmt.Print("Value: ");
			fmt.Println(cookie.Value)
		}


		session, err := manager.Rethink.Get(c.Request(), "SESSION_ID");

		if (err != nil) {
			fmt.Println("Error while fetching a session", err);
		}

		fmt.Println("SESSION: ", session.IsNew, session.Values);

		//
		//// Get Session Cookie
		//cookie, err := c.Cookie("SESSION_ID");
		//var tokenId string;
		//if err == nil {
		//	tokenId, err = manager.Cookie.DecodeCookie(cookie);
		//	if (err == nil) {
		//		fmt.Println("GOT THE COOKIE: " + tokenId);
		//	} else {
		//		// We've found an invalid cookie. It's safe to delete
		//		cookie.Expires = time.Now().Add(-1 * time.Second);
		//		c.SetCookie(cookie);
		//		return next(c);
		//	}
		//}


		// @TODO: We've got the cookie. Now we need to find out if it points to a valid session


		//if (err != nil) {
		//	next(c);
		//}

		return next(c);
	}
}

