package cron

import (
	"github.com/iKonrad/typitap/server/services/stats"
)

func registerStatsJobs() {

	c.AddFunc("0 * * * * *", func() {
		stats.CalculateStats()
	})


}


