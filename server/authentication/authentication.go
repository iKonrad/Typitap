package authentication

import (
	"github.com/iKonrad/typitap/server/entities"
)


type Authentication struct {
	SessionManager SessionManager
	CookieManager CookieManager
}

var Auth Authentication;
//var Middleware AuthenticationMiddleWare;

func init() {
	Auth = Authentication{
		SessionManager: SessionManager{ sessions: make(map[string]string) },
		CookieManager: newCookieManager(),
	};
}



func (a Authentication) Logout() bool {
	return true;
}

func (a Authentication) LoginUser(user entities.User) bool {
	return true;
}

func (a Authentication) IsLoggedIn() bool {
	return true;
}

//func (a Authentication) GetCurrentUser() entities.User {
//
//}