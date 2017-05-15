package cron

import (
	"github.com/iKonrad/typitap/server/game/topchart"
)

func registerChartJobs() {

	c.AddFunc("0 0 0 * * *", func() {
		topchart.ResetChart("today");
	})

	c.AddFunc("0 0 0 * * 1", func() {
		topchart.ResetChart("week");
	})

	c.AddFunc("0 0 0 1 * *", func() {
		topchart.ResetChart("month");
	})

}


