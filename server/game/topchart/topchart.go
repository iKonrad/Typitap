package topchart

import (
	"log"
	"sort"

	db "github.com/iKonrad/typitap/server/database"
	"github.com/iKonrad/typitap/server/entities"
	r "gopkg.in/gorethink/gorethink.v3"
	"github.com/iKonrad/typitap/server/logs"
	"strconv"
	"github.com/iKonrad/typitap/server/manager"
)

var charts map[string]entities.GameChart
var resultChannel chan *entities.GameChart
var resetChartChannel chan string

const MAX_CHART_LENGTH = 10

func run() {

	for {
		select {
		case c := <-resultChannel:
			saveChart(c)
		case name := <-resetChartChannel:
			removeChart(name)
		}

	}

}

func init() {

	resultChannel = make(chan *entities.GameChart, 2)
	resetChartChannel = make(chan string)

	charts = make(map[string]entities.GameChart)
	names := []string{
		"today",
		"month",
	}

	for _, name := range names {

		chart, ok := pullChart(name)
		if ok {
			charts[name] = chart
		} else {
			newChart := createChart(name)
			charts[name] = newChart
			r.Table("game_charts").Insert(newChart).Exec(db.Session)
		}

	}

	go run()
}

// Retries the chart for a given name
func pullChart(name string) (entities.GameChart, bool) {
	res, err := r.Table("game_charts").Get(name).Merge(func(p r.Term) interface{} {
		return map[string]interface{}{
			"items": r.Table("game_results").GetAll(r.Args(p.Field("items"))).CoerceTo("array").Merge(func(i r.Term) interface{} {
				return map[string]interface{}{
					"userId": r.Table("users").Get(i.Field("userId")),
					"sessionId": r.Table("game_sessions").Get(i.Field("sessionId")).Merge(func(j r.Term) interface{} {
						return map[string]interface{}{
							"textId": r.Table("game_texts").Get(j.Field("textId")),
						}
					}),
				}
			}),

		}
	}).Run(db.Session)
	defer res.Close()

	if res.IsNil() {
		return entities.GameChart{}, false
	}

	var returnedChart entities.GameChart
	err = res.One(&returnedChart)

	if err != nil {
		log.Println("Error while pulling a chart, ", err.Error())
		return entities.GameChart{}, false
	}

	sort.Sort(entities.SortResultsByScore(returnedChart.Items))

	// Remove passwords and e-mails from the user objects
	for i, _ := range returnedChart.Items {
		manager.User.SanitizeUser(&returnedChart.Items[i].User)
	}

	return returnedChart, true
}

func createChart(name string) entities.GameChart {

	newChart := entities.GameChart{
		Id:    name,
		Items: []entities.GameResult{},
	}
	return newChart
}

func saveChart(chart *entities.GameChart) {

	charts[chart.Id] = *chart
	err := r.Table("game_charts").Get(chart.Id).Update(chart).Exec(db.Session)
	if err != nil {
		log.Println("Error whle saving chart", err)
	}
}

func CheckTopChart(result *entities.GameResult) bool {


	log.Println("Checking ", result);
	updated := false
	for name, c := range charts {
		log.Println("Chart ", name);
		if len(c.Items) < MAX_CHART_LENGTH {
			log.Println("Found empty space, adding in")
			addRecordToChart(name, result)
			updated = true
			continue
		}

		lastItem := c.Items[len(c.Items)-1]
		log.Println("Item ", lastItem.WPM)
		// Check if the score is higher than last item
		if result.WPM > lastItem.WPM {
			log.Println("Yes 1")
			addRecordToChart(name, result)
			updated = true
		} else if result.WPM == lastItem.WPM {
			log.Println("Yes 2")
			if result.Accuracy > lastItem.Accuracy {
				addRecordToChart(name, result)
				updated = true
			}
		}

	}

	return updated

}

func addRecordToChart(name string, result *entities.GameResult) {

	manager.User.SanitizeUser(&result.User)

	chartCopy := charts[name]
	chart := &chartCopy
	if len(chart.Items) > 0 && len(chart.Items) >= MAX_CHART_LENGTH {
		chart.Items = chart.Items[:MAX_CHART_LENGTH-1]
	}

	chart.Items = append(chart.Items, *result)
	sort.Sort(entities.SortResultsByScore(chart.Items))
	logs.Log("New highscore", "New highscore for " + name + " chart. Score: " + strconv.Itoa(result.WPM), []string{"game", "chart"}, "Charts")
	resultChannel <- chart
}

func removeChart(name string) {
	logs.Log("Resetting chart", "Resetting " + name + " chart", []string{"game", "chart", "cron"}, "Charts")
	newChart := createChart(name)
	charts[name] = newChart
	saveChart(&newChart)
}

func ResetChart(name string) {
	resetChartChannel <- name
}

func GetChart(name string) entities.GameChart {
	return charts[name];
}

func GetCharts() map[string]entities.GameChart {
	return charts;
}