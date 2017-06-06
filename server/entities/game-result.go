package entities

import "time"

type GameResult struct {
	Id       string         `gorethink:"id,omitempty"`
	User     User           `gorethink:"userId,reference" gorethink_ref:"id"`
	Created  time.Time      `gorethink:"created"`
	WPM      int            `gorethink:"wpm"`
	Accuracy int            `gorethink:"accuracy"`
	Time     int            `gorethink:"time"`
	Mistakes map[string]int `gorethink:"mistakes"`
	Session  GameSession    `gorethink:"sessionId,reference" gorethink_ref:"id"`
	Place    int            `gorethink:"place"`
}

type SortResultsByScore []GameResult

func (a SortResultsByScore) Len() int {
	return len(a)
}
func (a SortResultsByScore) Swap(i, j int) {
	a[i], a[j] = a[j], a[i]
}
func (a SortResultsByScore) Less(i, j int) bool {
	if a[i].WPM > a[j].WPM {
		return true
	} else if a[i].WPM == a[j].WPM {
		if a[i].Accuracy > a[j].Accuracy {
			return true
		}
	}
	return false
}
