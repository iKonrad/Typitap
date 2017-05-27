package entities


type ActivityType struct {
	Id string `gorethink:"id,omitempty"`
	Text string `gorethink:"text"`
	Icon string `gorethink:"icon"`
	Global bool `gorethink:"global"`
}