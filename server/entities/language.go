package entities

type Language struct {
	Id string `gorethink:"id, omitempty"`
	Name string `gorethink:"name"`
}