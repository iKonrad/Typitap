package database

import (
	r "gopkg.in/gorethink/gorethink.v3"
	"log"
	"github.com/iKonrad/typitap/server/config"
)


var Session *r.Session

func init() {
	var err error

	databaseHost := config.GetString("database_host") + ":" + config.GetString("database_port")
	databaseName := config.GetString("database_name");

	Session, err = r.Connect(r.ConnectOpts{
		Address:  databaseHost,
		MaxOpen:  30,
		Database: databaseName,
	})

	if err != nil {
		log.Fatalln(err.Error())
	}
}
