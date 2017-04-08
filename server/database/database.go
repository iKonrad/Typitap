package database

import (
	r "gopkg.in/gorethink/gorethink.v3"
	"log"
)

type DB struct {
	session *r.Session
}

func (this DB) Run(term r.Term) (*r.Cursor, error) {
	return term.Run(this.session);
}

func (this DB) Exec(term r.Term) error {
	return term.Exec(this.session);
}

const (
	MAX_OPEN = 30
)

func CreateDatabase() *DB {

	var err error

	session, err := r.Connect(r.ConnectOpts{
		Address:    "localhost:28015",
		MaxOpen:    MAX_OPEN,

	})
	if err != nil {
		log.Fatalln(err.Error())
	}

	return &DB{
		session: session,
	}

}
