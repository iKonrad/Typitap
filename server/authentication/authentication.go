package authentication

import (
	"github.com/iKonrad/typitap/server/entities"
	"log"
)

type AuthenticationManager struct {
}

var Authentication AuthenticationManager;

// Stores a current Logged in user. Otherwise nil
var currentUser *entities.User

// Stores value about the logged in status
var isLoggedIn bool = false;

func init() {
	Authentication = AuthenticationManager{};
}

func (a AuthenticationManager) VerifyCookie() bool {
	user := entities.User{};
	log.Println(user);
	return true;
}


func (a AuthenticationManager) Logout() bool {
	return true;
}

func (a AuthenticationManager) LoginUser(user *entities.User) string {

	// 1. Create a Session ID token
	// 2. Add new session entry
	// 3. Return Session ID

	return "111";
}

func (a AuthenticationManager) IsLoggedIn() bool {
	return true;
}
