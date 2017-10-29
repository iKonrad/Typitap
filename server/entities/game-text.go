package entities

type GameText struct {
	Id   string `gorethink:"id, omitempty"`
	Text string `gorethink:"text"`
	Disabled bool `gorethink:"disabled"`
	Language string `gorethink:"language"`
}
