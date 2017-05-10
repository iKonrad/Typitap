package logs

import (
	"sync"

	"github.com/DataDog/datadog-go/statsd"
	"github.com/iKonrad/typitap/server/config"
)

var client *statsd.Client

var once sync.Once

func c() *statsd.Client {
	once.Do(func() {
		var err error
		client, err = statsd.New("127.0.0.1:8125")

		if err != nil {
			panic(err)
		}

		client.Namespace = "typitap."
		if config.GetBool("debug") {
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
