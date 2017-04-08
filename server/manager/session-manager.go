package manager

import (
	"github.com/gorilla/sessions"
)

type SessionManager struct {
	Store *sessions.CookieStore
}

var Session SessionManager;

func init() {

	//sessionSecret, err := uuid.NewV4();
	//
	//if (err != nil) {
	//	panic("Error while creating session secret!");
	//}

	Session = SessionManager{
		Store: sessions.NewCookieStore([]byte("UVHY!!NSeWFXN@W5EQTTnBiM%33jNURiMjly%8YVdYX2d3TUJB#UT^FUWlhOemFX")),
	}
}

