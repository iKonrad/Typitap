package entities

import "time"

type User struct {
	Id       string `gorethink:"id,omitempty"`
	Name     string `gorethink:"name"`
	Email    string `gorethink:"email"`
	Password string `gorethink:"password"`
	Username string `gorethink:"username"`

	Active bool `gorethink:"active"`
	Role string `gorethink:"role"`

	Created time.Time `gorethink:"created"`

	Level int `gorethink:"level"`
	Exp int `gorethink:"exp"`
}
