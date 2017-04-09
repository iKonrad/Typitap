package entities

import (
	"encoding/gob"
)

type SessionCookie struct {
	UserId string
	Role   string
}

func init() {
	gob.Register(&SessionCookie{})
}
