package websocket

import (
	"time"
	"github.com/gorilla/websocket"
	"net/http"
	"log"
	"github.com/labstack/echo"
	"github.com/iKonrad/typitap/server/entities"
	"math/rand"
	"strconv"
	"encoding/json"
)

const (
	WRITE_WAIT = 10 * time.Second
	PONG_WAIT = 60 * time.Second
	PING_PERIOD = (PONG_WAIT * 9) / 10
	MAX_MESSAGE_SIZE = 1024 * 1024
)

type Client struct {
	identifier string
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

func ServeWs (context echo.Context) {

	if context.Request().Method != "GET" {
		http.Error(context.Response().Writer, "Method not allowed", http.StatusMethodNotAllowed);
		return
	}

	ws, err := upgrader.Upgrade(context.Response().Writer, context.Request(), nil);
	if err != nil {
		log.Println(err);
		return
	}

	// Check if user exists. If exists, use username as a identifier. Otherwise, create an anonymous ID

	var identifier string;
	if context.Get("IsLoggedIn").(bool) {
		user := context.Get("User").(entities.User)
		identifier = user.Username
	} else {
		randomNumber := rand.Int();
		identifier = "guest-" + strconv.Itoa(randomNumber);
	}

	c := &Client {
		identifier: identifier,
		send: make(chan []byte, MAX_MESSAGE_SIZE),
		ws: ws,
	}

	hub.registerChannel <- c;

	c.SendMessage(TYPE_CONNECTED, map[string]interface{}{
		"identifier": identifier,
	})

	go c.writePump()
	c.readPump()

}


func (c *Client) readPump() {

	defer func() {
		hub.unregisterChannel <- c
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

		hub.broadcastChannel <- string(message)
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


func (c *Client) SendMessage(messageType string, message interface{}) {


	messageObject := map[string]interface{}{
		"type": messageType,
		"data": message,
	}

	encoded, err := json.Marshal(messageObject);
	if  err != nil {
		log.Println("Error while encoding a payload")
	}
	c.write(websocket.TextMessage, encoded);

}
