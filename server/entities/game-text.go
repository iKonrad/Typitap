package entities

type GameText struct {
	Id 	string `gorethink:"id, omitempty"`
	Text 	string `gorethink:"text"`
}