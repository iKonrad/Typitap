package graphics

import (
	"github.com/fogleman/gg"
	"github.com/iKonrad/typitap/server/entities"
	"strconv"
	"math"
	"github.com/iKonrad/typitap/server/services/utils"
)

func drawResultUsername(dc *gg.Context, username string) {
	if err := dc.LoadFontFace("client/assets/fonts/Dosis/Dosis-Regular.ttf", 18); err != nil {
		panic(err)
	}
	dc.SetRGB255(0, 0, 0)
	dc.DrawStringAnchored("#" + username, 232, 110, 0.5, 0.5)
}



func drawResults(dc *gg.Context, results entities.GameResult) {

	if err := dc.LoadFontFace("client/assets/fonts/Dosis/Dosis-SemiBold.ttf", 30); err != nil {
		panic(err)
	}
	dc.SetRGB255(0, 0, 0)

	dc.DrawStringAnchored(strconv.Itoa(results.WPM), 70, 196, 0.5, 0.5)
	dc.DrawStringAnchored(strconv.Itoa(results.Accuracy) + "%", 172, 196, 0.5, 0.5)

	mistakes := len(results.Mistakes)

	dc.DrawStringAnchored(strconv.Itoa(mistakes), 512, 193, 0.5, 0.5)

	if err := dc.LoadFontFace("client/assets/fonts/Dosis/Dosis-SemiBold.ttf", 40); err != nil {
		panic(err)
	}

	timeMinutes := int(results.Time / 60)
	timeSeconds := int(math.Mod(float64(results.Time), 60))

	time := utils.LeftPad(strconv.Itoa(timeMinutes), "0", 2) + ":" + utils.LeftPad(strconv.Itoa(timeSeconds), "0", 2)

	dc.DrawStringAnchored(time, 400, 202, 0.5, 0.5)

}