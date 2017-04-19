package websocket

import (
	"time"
	"github.com/gorilla/websocket"
	"net/http"
	"log"
)

const (
	WRITE_WAIT = 10 * time.Second
	PONG_WAIT = 60 * time.Second
	PING_PERIOD = (PONG_WAIT * 9) / 10
	MAX_MESSAGE_SIZE = 1024 * 1024
)

type Client struct {
	ws *websocket.Conn
	send chan []byte
}

var upgrader websocket.Upgrader;


func init() {
	upgrader = websocket.Upgrader{
		ReadBufferSize: MAX_MESSAGE_SIZE,
		WriteBufferSize: MAX_MESSAGE_SIZE,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
}

func ServeWs (w http.ResponseWriter, r *http.Request) {

	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed);
		return
	}

	ws, err := upgrader.Upgrade(w, r, nil);
	if err != nil {
		log.Println(err);
		return
	}

	c := &Client {
		send: make(chan []byte, MAX_MESSAGE_SIZE),
		ws: ws,
	}

	Hub.registerChannel <- c;

	go c.writePump()
	c.readPump()

}


func (c *Client) readPump() {

	defer func() {
		Hub.unregisterChannel <- c
		c.ws.Close();
	}()

	c.ws.SetReadLimit(MAX_MESSAGE_SIZE);
	c.ws.SetReadDeadline(time.Now().Add(PONG_WAIT))
	log.Println("Deadline:", time.Now().Add(PONG_WAIT))
	c.ws.SetPongHandler(func (string) error {
		log.Println("Pong handler");
		c.ws.SetReadDeadline(time.Now().Add(PONG_WAIT))
		return nil
	})

	for {
		log.Println("Waiting for messages...");
		_, message, err := c.ws.ReadMessage()
		log.Println("Message read: ", message)
		if err != nil {
			break
		}

		Hub.broadcastChannel <- string(message)
	}
}


func (c *Client) writePump() {
	ticker := time.NewTicker(PING_PERIOD)

	defer func() {
		ticker.Stop()
		c.ws.Close()
	}()

	for {
		select {
		case message, ok := <- c.send:
			if !ok {
				c.write(websocket.CloseMessage, []byte{})
				return
			}
			if err := c.write(websocket.TextMessage, message); err != nil {
				return
			}
		case <- ticker.C:
			if err := c.write(websocket.PingMessage, []byte{}); err != nil {
				return
			}
		}
	}
}

func (c *Client) write(mt int, message []byte) error {
	c.ws.SetWriteDeadline(time.Now().Add(WRITE_WAIT));
	return c.ws.WriteMessage(mt, message)
}