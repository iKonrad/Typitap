package database

import (
	r "gopkg.in/gorethink/gorethink.v3"
	"log"
)

type Database struct {
	session *r.Session
}

func (this Database) Run(term r.Term) (*r.Cursor, error) {
	return term.Run(this.session);
}

func (this Database) Exec(term r.Term) error {
	return term.Exec(this.session);
}

const (
	MAX_OPEN = 30
	DB_NAME = "typitap"
)

var Session *r.Session


func init() {
	var err error;
	Session, err = r.Connect(r.ConnectOpts{
		Address:    "localhost:28015",
		MaxOpen:    MAX_OPEN,
		Database: DB_NAME,
	})

	if err != nil {
		log.Fatalln(err.Error())
	}
}