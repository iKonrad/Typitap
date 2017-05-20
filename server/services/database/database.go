package database

import (
	r "gopkg.in/gorethink/gorethink.v3"
	"log"
	"github.com/iKonrad/typitap/server/config"
	"github.com/go-redis/redis"
)


var Session *r.Session
var Redis *redis.Client

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


	Redis = redis.NewClient(&redis.Options{
		Addr:     config.GetString("redis_host"),
		Password: "",                                 // no password set
		DB:       config.Get("redis_database").(int), // use default DB
	})

	if config.GetBool("debug") {
		// Flush redis database
		Redis.FlushDb()
	}


}
