package entities


type UserFeedFollow struct {
	User User `gorethink:"userId,reference" gorethink_ref:"id"`
	Followers []User `gorethink:"followers,reference" gorethink_ref:"id"`
	Following []User `gorethink:"following,reference" gorethink_ref:"id"`
}