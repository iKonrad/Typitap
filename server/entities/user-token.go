package entities

import "time"

type UserToken struct {
	Token string `gorethink:"token"`
	Expires time.Time `gorethink:"expires"`
	User User `gorethink:"userId,reference" gorethink_ref:"id"`
	Used bool `gorethink:"used"`
	Type string `gorethink:"type"`
}