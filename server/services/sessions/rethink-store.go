// Copyright 2015 Brian "bojo" Jones. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

package sessions

import (
	s "github.com/boj/rethinkstore"
	"github.com/iKonrad/typitap/server/config"
)

var Session *s.RethinkStore

func init() {

	databaseHost := config.Config.UString("database_host", "localhost") + ":" + config.Config.UString("database_port", "28015")
	databaseName := config.Config.UString("database_name", "typitap")
	// Fetch new store.
	var err error
	Session, err = s.NewRethinkStore(
		databaseHost,
		databaseName,
		"sessions",
		5,  /*MaxIdle*/
		10, /*MaxOpen*/
		[]byte("G45g$H%6jk4J@3@J#JZ#@#Jx@$J#J654V&%Jb$J8BJ8J#"))
	if err != nil {
		panic(err)
	}
}
