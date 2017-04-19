package websocket

import "log"

type SocketHub struct {
	clients    map[*Client]bool
	broadcastChannel  chan string;
	registerChannel   chan *Client
	unregisterChannel chan *Client

}

var Hub SocketHub;

func init() {
	Hub = SocketHub{
		broadcastChannel:  make(chan string),
		registerChannel:   make(chan *Client),
		unregisterChannel: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

func (h *SocketHub) Run() {
	for {
		select {
		case c := <-h.registerChannel:
			log.Println("New client");
			h.clients[c] = true
			break

		case c := <-h.unregisterChannel:
			log.Println("Client disconnected")
			_, ok := h.clients[c]
			if ok {
				delete(h.clients, c);
			}
		case m := <-h.broadcastChannel:
			h.broadcastMessage(m)
			break
		}
	}
}

func (h *SocketHub) broadcastMessage(message string) {
	for c := range h.clients {
		select {
		case c.send <- []byte(message):
			log.Println("Broadcasting message: ", message)
			break
		default:
			close(c.send)
			delete(h.clients, c)
		}

	}
}
