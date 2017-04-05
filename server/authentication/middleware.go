package authentication

import (

	//"github.com/gorilla/schema"
	//"github.com/gorilla/securecookie"
	//"github.com/gorilla/sessions"
	"github.com/labstack/echo"
	"fmt"
	//"net/http"
	"log"
	"strings"
	"time"
	"github.com/iKonrad/typitap/server/manager"
)


// Declare global variables




type AuthenticationMiddleWare struct {
}

func newMiddleWare() AuthenticationMiddleWare {
	middleware := AuthenticationMiddleWare{};
	return middleware;
}


func (m AuthenticationMiddleWare) Handle(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {

		// Ignore static file requests
		if (strings.HasPrefix(c.Request().URL.Path, "/static")) {
			return next(c);
		}


		fmt.Println("Cookies for path: " + c.Request().URL.Path);
		for _, cookie := range c.Cookies() {
			fmt.Print("Name: ");
			fmt.Println(cookie.Name)
			fmt.Print("Value: ");
			fmt.Println(cookie.Value)
		}


		// Get cookie
		cookie, err := c.Cookie("SESSION_ID");
		if err == nil {
			decodedValue, err := manager.Cookie.DecodeCookie(cookie);
			if (err == nil) {
				fmt.Println("GOT THE COOKIE: " + decodedValue);
			} else {
				// We've found some unrecognized cookie. It's safe to delete
				cookie.Expires = time.Now().Add(-1 * time.Second);
			}

		} else {
			log.Println(err);
			fmt.Println("COOKIE NOT FOUND");
			cookie, err = manager.Cookie.CreateCookie("SESSION_ID", "TESTVALUE")
		}


		c.SetCookie(cookie);

		return next(c);
	}
}
