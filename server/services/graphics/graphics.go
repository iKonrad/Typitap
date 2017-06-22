package graphics;

import (
	"github.com/fogleman/gg"
	"github.com/iKonrad/typitap/server/entities"
)

func init() {

}

func GenerateUserboard(username string, userId string, stats map[string]interface{}) {
	dc := gg.NewContext(600, 100)
	im, err := gg.LoadPNG("static/images/userboard_template.png")

	if err != nil {
		panic(err);
	}


	dc.DrawImage(im, 0, 0)

	drawUsername(dc, username)
	drawGamesPlayed(dc, int(stats["gamesPlayed"].(float64)))
	drawStats(dc, stats)

	dc.SavePNG("static/images/userboards/" + userId + ".png")
}


func GenerateResultboard(result entities.GameResult) {

	dc := gg.NewContext(600, 310)
	im, err := gg.LoadPNG("static/images/resultboard_template.png")

	if err != nil {
		panic(err);
	}

	dc.DrawImage(im, 0, 0)

	drawResults(dc, result)

	dc.SavePNG("static/images/resultboards/" + result.Id + ".png")

}