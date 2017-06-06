package config

import (
	"log"

	"github.com/iKonrad/typitap/server/assets"
	"github.com/olebedev/config"
)

var Config *config.Config
var Routes *config.Config

func init() {

	// Fetch general configs
	cfgBytes, err := assets.Asset("config/config.yml")
	if err != nil {
		panic(err)
	}
	Config, err = config.ParseYaml(string(cfgBytes[:]))
	if err != nil {
		log.Fatalf("error: %v", err)
	}

	// Fetch routing configuration
	routeBytes, err := assets.Asset("config/route_roles.yml")
	if err != nil {
		log.Fatalf("error: %v", err)
	}
	Routes, err = config.ParseYaml(string(routeBytes[:]))
	if err != nil {
		log.Fatalf("error: %v", err)
	}

}
