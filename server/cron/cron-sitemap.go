package cron

import (
	"github.com/iKonrad/typitap/server/config"
	"github.com/iKonrad/typitap/server/services/seo"
)

func registerSitemapJobs() {

	c.AddFunc("0 0 0 * * *", func() {
		seo.GenerateSitemap(config.Config.UString("env") == "prod")
	})

}
