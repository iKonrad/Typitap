package seo

import (
	db "github.com/iKonrad/typitap/server/services/database"
	"github.com/ikeikeikeike/go-sitemap-generator/stm"
	r "gopkg.in/gorethink/gorethink.v3"
	"log"
	"github.com/iKonrad/typitap/server/config"
)

func GenerateSitemap(notify bool) {
	log.Println("Generating sitemap")
	sm := stm.NewSitemap()
	sm.SetDefaultHost("https://typitap.com")
	sm.SetPublicPath("static")
	sm.SetSitemapsPath("sitemaps")
	sm.SetFilename("sitemap")
	// Create method must be that calls first this method in that before
	// call to Add method on this struct.
	sm.Create()

	sm.Add(stm.URL{"loc": "/", "changefreq": "daily", "mobile": true, "priority": "0.9"})
	sm.Add(stm.URL{"loc": "/login", "changefreq": "monthly", "mobile": true})
	sm.Add(stm.URL{"loc": "/signup", "changefreq": "monthly", "mobile": true})
	sm.Add(stm.URL{"loc": "/play", "changefreq": "daily", "mobile": true})
	sm.Add(stm.URL{"loc": "/about", "changefreq": "monthly", "mobile": true})
	sm.Add(stm.URL{"loc": "/terms", "changefreq": "yearly", "mobile": true})
	sm.Add(stm.URL{"loc": "/privacy", "changefreq": "yearly", "mobile": true})

	resp, err := r.Table("users").Pluck("username").Run(db.Session)

	if err == nil {
		var users []map[string]interface{}
		err = resp.All(&users)

		for _, user := range users {
			sm.Add(stm.URL{
				"loc":        "/u/" + user["username"].(string),
				"changefreq": "weekly",
				"mobile":     true,
			})
		}
	}

	if notify && !config.Config.UBool("debug") {
		sm.Finalize().PingSearchEngines()
	} else {
		sm.Finalize()
	}

}
