package entities

type User struct{

	// Details
	Id int
	FirstName string
	LastName string
	Email string

	// Authentication
	Password string
	ConfirmToken string
	Confirmed bool
	RecoverToken string
	RecoverTokenExpiry string

}

