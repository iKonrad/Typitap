package entities

import "time"

type Activity struct {
	Id      string            `gorethink:"id,omitempty"`
	Created time.Time         `gorethink:"created"`
	Type    ActivityType      `gorethink:"typeId,reference" gorethink_ref:"id"`
	Data    map[string]string `gorethink:"data"`
}
