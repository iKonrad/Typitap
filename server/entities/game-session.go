package entities

import "time"

type GameSession struct {
	Id       string `gorethink:"id,omitempty"`
	Users    []User `gorethink:"userIds,reference" gorethink_ref:"id"`
	Created  time.Time `gorethink:"created"`
	Online   bool `gorethink:"online"`
	Open     bool `gorethink:"open"`
	Finished bool `gorethink:"finished"`
	Text     GameText `gorethink:"textId,reference" gorethink_ref:"id"`
}
