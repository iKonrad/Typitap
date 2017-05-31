package entities


type Level struct {
	Level int `gorethink:"level,omitempty"`
	Name string `gorethink:"name"`
}