package entities

type UserFeed struct {
	User  User       `gorethink:"userId,reference" gorethink_ref:"id"`
	Items []Activity `gorethink:"items,reference" gorethink_ref:"id"`
}
