package websocket

import (
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/websocket"
	"github.com/iKonrad/typitap/server/entities"
	"github.com/iKonrad/typitap/server/services/logs"
	"github.com/iKonrad/typitap/server/services/user"
	"github.com/iKonrad/typitap/server/services/utils"
	"github.com/labstack/echo"
)

const (
	WRITE_WAIT       = 10 * time.Second
	PONG_WAIT        = 60 * time.Second
	PING_PERIOD      = (PONG_WAIT * 9) / 10
	MAX_MESSAGE_SIZE = 1024 * 1024
)

type Client struct {
	user       *entities.User
	identifier string
	ws         *websocket.Conn
	send       chan []byte
	ip         string
	country    string
}

var upgrader websocket.Upgrader

func init() {
	upgrader = websocket.Upgrader{
		ReadBufferSize:  MAX_MESSAGE_SIZE,
		WriteBufferSize: MAX_MESSAGE_SIZE,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
}

func ServeWs(context echo.Context) {

	if context.Request().Method != "GET" {
		http.Error(context.Response().Writer, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	ws, err := upgrader.Upgrade(context.Response().Writer, context.Request(), nil)
	if err != nil {
		logs.Error("Websocket error", "Error while upgrading a request: "+err.Error(), []string{"websocket"}, "Websocket error")
		return
	}

	// Check if user exists. If exists, use username as a identifier. Otherwise, create a guest ID
	var identifier string
	var newUser entities.User
	if context.Get("IsLoggedIn").(bool) {
		newUser := context.Get("User").(entities.User)
		identifier = newUser.Username
	} else {
		randomNumber := rand.Int()
		identifier = "guest-" + strconv.Itoa(randomNumber)
	}

	ip := utils.GetIPAdress(context.Request())
	country, _ := user.GetCountryCodeByIP(ip)

	c := &Client{
		user:       &newUser,
		identifier: identifier,
		send:       make(chan []byte, MAX_MESSAGE_SIZE),
		ws:         ws,
		ip:         ip,
		country:    country,
	}

	hub.registerChannel <- c
	c.SendMessage(TYPE_CONNECTED, map[string]interface{}{
		"identifier": identifier,
	})

	go c.writePump()
	c.readPump()

}

func (c *Client) readPump() {

	defer func() {
		hub.unregisterChannel <- c
		c.ws.Close()
	}()

	c.ws.SetReadLimit(MAX_MESSAGE_SIZE)
	c.ws.SetReadDeadline(time.Now().Add(PONG_WAIT))
	c.ws.SetPongHandler(func(string) error {
		c.ws.SetReadDeadline(time.Now().Add(PONG_WAIT))
		return nil
	})

	for {
		_, message, err := c.ws.ReadMessage()

		if err != nil {
			break
		}

		var decodedMessage map[string]interface{}
		json.Unmarshal(message, &decodedMessage)

		c.parseMessage(c.identifier, decodedMessage)
	}
}

func (c *Client) parseMessage(identifier string, message map[string]interface{}) {
	GetEngine().parseMessage(c, message)
}

func (c *Client) writePump() {
	ticker := time.NewTicker(PING_PERIOD)

	defer func() {
		ticker.Stop()
		c.ws.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			logs.Incr("socketMessages", []string{"websocket"})
			if !ok {
				c.write(websocket.CloseMessage, []byte{})
				return
			}
			if err := c.write(websocket.TextMessage, message); err != nil {
				return
			}
		case <-ticker.C:
			logs.Incr("socketMessages", []string{"websocket"})
			if err := c.write(websocket.PingMessage, []byte{}); err != nil {
				return
			}
		}
	}
}

func (c *Client) write(mt int, message []byte) error {
	c.ws.SetWriteDeadline(time.Now().Add(WRITE_WAIT))
	return c.ws.WriteMessage(mt, message)
}

func (c *Client) SendMessage(messageType string, message interface{}) {

	messageObject := map[string]interface{}{
		"type": messageType,
		"data": message,
	}

	encoded, err := json.Marshal(messageObject)
	if err != nil {
		log.Println("Error while encoding a payload")
	}

	logs.Incr("socketMessages", []string{"websocket"})
	c.send <- encoded
}
