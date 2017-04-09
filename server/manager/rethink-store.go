// Copyright 2015 Brian "bojo" Jones. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

package manager

import (
	s "github.com/boj/rethinkstore"
)

var Session *s.RethinkStore

func init() {


	// Fetch new store.
	var err error;
	Session, err = s.NewRethinkStore("127.0.0.1:28015",
		"typitap",
		"sessions",
		5 /*MaxIdle*/,
		10 /*MaxOpen*/,
		[]byte("G45g$H%6jk4J@3@J#JZ#@#Jx@$J#J654V&%Jb$J8BJ8J#"))
	if err != nil {
		panic(err)
	}
}
