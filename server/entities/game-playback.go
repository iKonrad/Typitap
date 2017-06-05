package entities


type GamePlayback struct {
	Id string `gorethink:"id,omitempty"`
	Playback []map[string]interface{} `gorethink:"playback"`
}