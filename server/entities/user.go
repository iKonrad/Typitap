package entities;

type User struct {
	Id        string `gorethink:"id,omitempty"`
	FirstName string `gorethink:"firstName"`
	LastName  string `gorethink:"lastName"`
	Email     string `gorethink:"email"`
	Password  string `gorethink:"password"`
}


