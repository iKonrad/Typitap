package entities

import "time"

type GameResult struct {
	Id       string `gorethink:"id,omitempty"`
	User     User `gorethink:"userId,reference" gorethink_ref:"id"`
	Created  time.Time `gorethink:"created"`
	WPM      int `gorethink:"wpm"`
	Accuracy int `gorethink:"accuracy"`
	Time     int `gorethink:"time"`
	Mistakes map[string]int `gorethink:"mistakes"`
	Session  GameSession `gorethink:"sessionId,reference" gorethink_ref:"id"`
}
