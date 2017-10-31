package entities

type GameText struct {
	Id   string `gorethink:"id,omitempty"`
	Text string `gorethink:"text"`
	Disabled bool `gorethink:"disabled"`
	Language Language `gorethink:"language,reference" gorethink_ref:"id"`
	ISBN string `gorethink:"isbn"`
}


