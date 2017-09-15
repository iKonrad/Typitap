package entities

import "time"

type GameText struct {
	Id       string `gorethink:"id,omitempty"`
	Text     string `gorethink:"text"`
	Disabled bool `gorethink:"disabled"`
	Created   time.Time `gorethink:"created"`
	CreatedBy User `gorethink:"createdById,reference" gorethink_ref:"id"`
	Type      int8 `gorethink:"type"`
	Title     string `gorethink:"title"`
	URL       string `gorethink:"url"`
}
