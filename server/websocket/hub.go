package websocket

import (
	"log"
	"sync"
	"encoding/json"
	"github.com/gorilla/websocket"
)

const (
	TYPE_GAME_START = "GAME_START"
	TYPE_CONNECTED = "CONNECTED"
	TYPE_LOGOUT = "LOGOUT"
)

type SocketHub struct {
	clients    map[string]*Client
	broadcastChannel  chan string;
	registerChannel   chan *Client
	unregisterChannel chan *Client

}

var hub *SocketHub;
var once sync.Once

// Singleton pattern
func GetHub() *SocketHub {
	once.Do(func() {
		hub = &SocketHub{
			broadcastChannel:  make(chan string),
			registerChannel:   make(chan *Client),
			unregisterChannel: make(chan *Client),
			clients:    make(map[string]*Client),
		}
	})
	return hub
}

func (h *SocketHub) Run() {
	for {
		select {
		case c := <-h.registerChannel:
			log.Println("New client");
			h.clients[c.identifier] = c
			break

		case c := <-h.unregisterChannel:
			log.Println("Client disconnected")
			_, ok := h.clients[c.identifier]
			if ok {
				delete(h.clients, c.identifier);
			}
		case m := <-h.broadcastChannel:
			h.broadcastMessage(m)
			break
		}
	}
}

func (h *SocketHub) broadcastMessage(message string) {
	for id,client := range h.clients {

		select {
		case client.send <- []byte("{\"name\":\"" + id + "\"}"):
			log.Println("Broadcasting message: ", message)
			break
		default:
			close(client.send)
			delete(h.clients, id)
		}

	}
}

func BroadcastMessage(messageType string, message interface{}) {


	messageObject := map[string]interface{}{
		"type": messageType,
		"data": message,
	}

	encoded, err := json.Marshal(messageObject);
	if  err != nil {
		log.Println("Error while encoding a payload")
	}
	hub.broadcastMessage(string(encoded))

}


func DisconnectClient(identifier string) {

	client, ok := hub.clients[identifier]
	if ok {
		closingMessage := map[string]interface{}{
			"type": TYPE_LOGOUT,
		};
		encoded, _ := json.Marshal(closingMessage);
		client.ws.WriteMessage(websocket.CloseMessage, encoded);
		defer client.ws.Close();
		delete(hub.clients, identifier);
	}

}

