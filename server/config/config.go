package config

import (
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"log"
	"path/filepath"
)

var data map[string]interface{}

func init() {

	fileName, _ := filepath.Abs("server/data/config/config.yml")
	configBytes := getConfigFileContent(fileName)

	err := yaml.Unmarshal(configBytes, &data)
	if err != nil {
		log.Fatalf("error: %v", err)
	}
}

func getConfigFileContent(path string) []byte {
	content, err := ioutil.ReadFile(path)

	if err != nil {
		panic(err)
	}

	return content
}

func Get(key string) (interface{}) {

	if value, ok := data[key]; !ok {
		return false
	} else {
		return value
	}
}

// Convenience method for Get
func GetString(key string) string {
	value := Get(key)
	return value.(string)
}

func GetBool(key string) bool {
	value := Get(key);
	return value.(bool)
}
