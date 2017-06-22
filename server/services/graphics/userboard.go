package graphics

import (
	"github.com/fogleman/gg"
	"strconv"
)

func drawUsername(dc *gg.Context, username string) {
	if err := dc.LoadFontFace("client/assets/fonts/Dosis/Dosis-Medium.ttf", 14); err != nil {
		panic(err)
	}
	dc.SetRGB255(255, 255, 255)
	dc.DrawStringAnchored("#" + username, 70, 55, 0.5, 0.5)
}

func drawGamesPlayed(dc *gg.Context, games int) {

	if err := dc.LoadFontFace("client/assets/fonts/Dosis/Dosis-Medium.ttf", 12); err != nil {
		panic(err)
	}
	dc.SetRGB255(255, 255, 255)

	dc.DrawStringAnchored(strconv.Itoa(games) + " games", 70, 85, 0.5, 0.5)

}


func drawStats(dc *gg.Context, stats map[string]interface{}) {

	if err := dc.LoadFontFace("client/assets/fonts/Dosis/Dosis-SemiBold.ttf", 30); err != nil {
		panic(err)
	}
	dc.SetRGB255(255, 255, 255)
	dc.DrawStringAnchored(strconv.Itoa(int(stats["wpm"].(float64))), 187, 35, 0.5, 0.5)
	dc.DrawStringAnchored(strconv.Itoa(int(stats["accuracy"].(float64))), 265, 35, 0.5, 0.5)
	dc.DrawStringAnchored(strconv.Itoa(int(stats["goldenTrophies"].(float64))), 393, 30, 0.5, 0.5)
	dc.DrawStringAnchored(strconv.Itoa(int(stats["silverTrophies"].(float64))), 471, 30, 0.5, 0.5)
	dc.DrawStringAnchored(strconv.Itoa(int(stats["bronzeTrophies"].(float64))), 549, 30, 0.5, 0.5)

}
