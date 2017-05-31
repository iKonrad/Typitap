package entities


type Level struct {
	Level int `gorethink:"level,omitempty"`
	Name string `gorethink:"name"`
	Icon string `gorethink:"icon"`
	Threshold int `gorethink:"threshold"`
}