package entities

type User struct {
	Id       string `gorethink:"id,omitempty"`
	Name     string `gorethink:"firstName"`
	Email    string `gorethink:"email"`
	Password string `gorethink:"password"`
	Username string `gorethink:"username"`

	Active bool `gorethink:"active"`
}
