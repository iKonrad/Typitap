package game

type Room struct {
	SessionId string
	players map[string]interface{}
}