package authentication



type AuthenticationManager struct {
}

var Authentication AuthenticationManager;


func init() {
	Authentication = AuthenticationManager{};
}



func (a AuthenticationManager) Logout() bool {
	return true;
}

func (a AuthenticationManager) LoginUser(user string) bool {
	return true;
}

func (a AuthenticationManager) IsLoggedIn() bool {
	return true;
}

//func (a Authentication) GetCurrentUser() entities.User {
//
//}