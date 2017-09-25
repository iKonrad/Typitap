package cron

import (
	"github.com/iKonrad/typitap/server/services/stats"
	"fmt"
)

func registerStatsJobs() {
	stats.CalculateAllStats()
	c.AddFunc("0 0 * * * *", func() {
		fmt.Println("CRON: Calculating stats for recent players")
		stats.CalculateStats()
	})

	c.AddFunc("0 0 0 * * *", func() {
		fmt.Println("CRON: Calculating stats for all players")
		stats.CalculateAllStats()
	})

}
