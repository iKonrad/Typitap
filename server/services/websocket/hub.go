package websocket

import (
	"encoding/json"
	"log"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/iKonrad/typitap/server/services/logs"
)

const (
	TYPE_CONNECTED = "CONNECTED" // Used after successful connection to the websocket server
	TYPE_ERROR     = "ERROR"     // Generic error type for any unsuccessful action

	TYPE_ONLINE_GAME_PLAYERS_SET = "ONLINE_GAME_PLAYERS_SET"
	TYPE_ONLINE_GAME_COUNTDOWN_STARTED = "TYPE_ONLINE_GAME_COUNTDOWN_STARTED"
	TYPE_ONLINE_GAME_COUNTDOWN_STOPPED = "TYPE_ONLINE_GAME_COUNTDOWN_STOPPED"
	TYPE_ONLINE_GAME_COUNTDOWN_SET = "TYPE_ONLINE_GAME_COUNTDOWN_SET"
	TYPE_ONLINE_GAME_RESET = "TYPE_ONLINE_GAME_RESET"
)

const (
	CODE_RECONNECT  = 5001
	CODE_DISCONNECT = 5000
)

type SocketHub struct {
	clients           map[string]*Client
	broadcastChannel  chan string
	registerChannel   chan *Client
	unregisterChannel chan *Client
}

var hub *SocketHub

var once sync.Once

// Singleton pattern
func GetHub() *SocketHub {
	once.Do(func() {
		hub = &SocketHub{
			broadcastChannel:  make(chan string),
			registerChannel:   make(chan *Client),
			unregisterChannel: make(chan *Client),
			clients:           make(map[string]*Client),
		}

	})
	return hub
}

func (h *SocketHub) Run() {
	for {
		select {
		case c := <-h.registerChannel:
			logs.Log("Client connected", "Client "+c.identifier+" connected to the websocket", []string{"websocket"}, "Websocket")
			h.clients[c.identifier] = c
			logs.Gauge("clients", float64(len(h.clients)), []string{"websocket"})
			break

		case c := <-h.unregisterChannel:
			logs.Log("Client disconnected", "Client "+c.identifier+" disconnected to the websocket", []string{"websocket"}, "Websocket")
			_, ok := h.clients[c.identifier]
			logs.Gauge("clients", float64(len(h.clients)), []string{"websocket"})
			if ok {
				delete(h.clients, c.identifier)
			}
		case m := <-h.broadcastChannel:
			h.broadcastMessage(m)
			break
		}
	}
}

func (h *SocketHub) broadcastMessage(message string) {
	for id, client := range h.clients {
		select {
		case client.send <- []byte(message):
			break
		default:
			close(client.send)
			delete(h.clients, id)
		}

	}
}

func (h *SocketHub) SendMessageToClient(identifier string, messageType string, message interface{}) bool {

	if _, ok := h.clients[identifier]; !ok {
		log.Println("Could not find client with ID " + identifier)
		return false
	}

	h.clients[identifier].SendMessage(messageType, message)
	return true
}

func isClientConnected(identifier string) bool {

	_, ok := GetHub().clients[identifier]
	return ok

}

func BroadcastMessage(messageType string, message interface{}) {

	messageObject := map[string]interface{}{
		"type": messageType,
		"data": message,
	}

	encoded, err := json.Marshal(messageObject)
	if err != nil {
		log.Println("Error while encoding a payload")
	}
	hub.broadcastMessage(string(encoded))

}

func ReconnectClient(identifier string) {

	client, ok := hub.clients[identifier]
	if ok {
		log.Println("RECONNECTING")
		client.ws.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(CODE_RECONNECT, "Login/Logout"))
		defer delete(hub.clients, identifier)
		defer client.ws.Close()
	}

}

func DisconnectClient(identifier string) {

	client, ok := hub.clients[identifier]
	if ok {
		client.ws.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(CODE_DISCONNECT, "Disconnect"))
		defer delete(hub.clients, identifier)
		defer client.ws.Close()
	}

}
