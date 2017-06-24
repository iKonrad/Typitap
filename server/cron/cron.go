package cron

import (
	"github.com/robfig/cron"
)

var c *cron.Cron

func RunJobs() {
	c = cron.New()
	registerChartJobs()
	registerStatsJobs()
	registerSitemapJobs()
	c.Start()
}
