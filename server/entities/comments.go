package entities

import "time"

type Comments struct {
	ChannelId string `gorethink:"id, omitempty"`
	Items []Comment `gorethink:"items"`
}

type Comment struct {
	Id   string `gorethink:"id, omitempty"`
	User User `gorethink:"userId,reference" gorethink_ref:"id"`
	Created time.Time `gorethink:"created"`
	Text string `gorethink:"text"`
}
