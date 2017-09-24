package logs

import (
	"sync"

	"github.com/DataDog/datadog-go/statsd"
	"github.com/iKonrad/typitap/server/config"
	"github.com/gregdel/pushover"
)

var client *statsd.Client
var pushoverClient *pushover.Pushover
var pushoverRecipient *pushover.Recipient

var once sync.Once

func c() *statsd.Client {
	once.Do(func() {
		var err error
		client, err = statsd.New("127.0.0.1:8125")

		pushoverClient = pushover.New(config.Config.UString("pushover.key", ""))
		pushoverRecipient = pushover.NewRecipient(config.Config.UString("pushover.recipient", ""))

		if err != nil {
			panic(err)
		}

		client.Namespace = "typitap."
		if config.Config.UBool("debug", false) {
			client.Tags = append(client.Tags, "debug")
		}
	})
	return client
}

func Success(title string, text string, tags []string, agg string) {
	event := statsd.NewEvent(title, text)
	if agg != "" {
		event.AggregationKey = agg
	}
	event.Priority = statsd.Low
	event.AlertType = statsd.Success
	event.Tags = tags
	c().Event(event)
}

func Log(title string, text string, tags []string, agg string) {
	event := statsd.NewEvent(title, text)
	if agg != "" {
		event.AggregationKey = agg
	}
	event.Priority = statsd.Low
	event.AlertType = statsd.Info
	event.Tags = tags
	c().Event(event)
}

func Warning(title string, text string, tags []string, agg string) {
	event := statsd.NewEvent(title, text)
	if agg != "" {
		event.AggregationKey = agg
	}
	event.Priority = statsd.Normal
	event.AlertType = statsd.Warning
	event.Tags = tags

	c().Event(event)
}

func Error(title string, text string, tags []string, agg string) {
	event := statsd.NewEvent(title, text)
	if agg != "" {
		event.AggregationKey = agg
	}
	event.Priority = statsd.Normal
	event.AlertType = statsd.Error
	event.Tags = tags
	c().Event(event)
	Push(title, text)
}

func Gauge(name string, value float64, tags []string) {
	c().Gauge(name, value, tags, 1)
}

func Count(name string, value int64, tags []string) {
	err := c().Count(name, value, tags, 1)
	if err != nil {
		Error("Count error", err.Error(), []string{"errors"}, "Log errors")
	}
}

func Incr(name string, tags []string) {
	err := c().Incr(name, tags, 1)
	if err != nil {
		Error("Incr error", err.Error(), []string{"errors"}, "Log errors")
	}
}

func Decr(name string, tags []string) {
	err := c().Decr(name, tags, 1)
	if err != nil {
		Error("Decr error", err.Error(), []string{"errors"}, "Log errors")
	}
}


func Push(title string, text string) {
	// Create the message to send
	message := pushover.NewMessageWithTitle(title, text)

	// Send the message to the recipient
	pushoverClient.SendMessage(message, pushoverRecipient)
}

func PushUrl(title string, text string, url string) {
	// Create the message to send
	message := &pushover.Message{
		Message:     text,
		Title:       title,
		URL:         url,
		URLTitle:    "See details",
	}



	// Send the message to the recipient
	pushoverClient.SendMessage(message, pushoverRecipient)
}