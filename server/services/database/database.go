package database

import (
	"log"

	"github.com/go-redis/redis"
	"github.com/iKonrad/typitap/server/config"
	r "gopkg.in/gorethink/gorethink.v3"
	"os"
)

var Session *r.Session
var Redis *redis.Client

func init() {
	var err error

	databaseHost := config.Config.UString("database_host", "") + ":" + config.Config.UString("database_port", "28015")
	databaseName, _ := config.Config.String("database_name")
	Session, err = r.Connect(r.ConnectOpts{
		Address:  databaseHost,
		MaxOpen:  30,
		Database: databaseName,
	})


	if err != nil {
		log.Fatalln(err.Error())
	}

	r.SetVerbose(true)
	r.Log.Out = os.Stdout

	Redis = redis.NewClient(&redis.Options{
		Addr:     config.Config.UString("redis_host", ""),
		Password: "",                                      // no password set
		DB:       config.Config.UInt("redis_database", 0), // use default DB
	})

	if config.Config.UBool("debug", false) {
		// Flush redis database
		Redis.FlushDb()
	}

}
