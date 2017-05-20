package stats

import (
	"log"
	"strconv"

	db "github.com/iKonrad/typitap/server/services/database"
	r "gopkg.in/gorethink/gorethink.v3"
)

func calculateStatsForUser(userId string) {
	log.Println("-> Calculating stats for " + userId)

	resp, err := r.Table("game_results").Filter(map[string]string{
		"userId": userId,
	}).OrderBy(r.Desc("created")).
		Limit(15).Run(db.Session)

	defer resp.Close()

	if err != nil {
		log.Println("ERR", err.Error())
		return
	}

	var results []map[string]interface{}
	err = resp.All(&results)

	log.Println("Pulled " + strconv.Itoa(len(results)) + " results")

	// No returns, we can stop the function
	if len(results) == 0 {
		log.Println("Returning...")
		return
	}

	var sumWpm int
	var sumAccuracy int
	for _, result := range results {
		sumWpm += int(result["wpm"].(float64))
		sumAccuracy += int(result["accuracy"].(float64))
		log.Println("Added WPM: " + strconv.Itoa(int(result["wpm"].(float64))) + " and Accuracy: " + strconv.Itoa(int(result["accuracy"].(float64))) + " results")
	}

	averageWpm := int(float32(sumWpm) / float32(len(results)))
	averageAccuracy := int(float32(sumAccuracy) / float32(len(results)))

	log.Println("-> !! Average WPM: " + strconv.Itoa(averageWpm) + " and Accuracy: " + strconv.Itoa(averageAccuracy) + " results")

	r.Table("user_stats").Get(userId).Update(map[string]interface{}{
		"wpm":      averageWpm,
		"accuracy": averageAccuracy,
	}).Exec(db.Session)
}

func CalculateStats() {

	log.Println("---> Calculating stats...")
	resp, err := r.Table("users").Pluck("id").Run(db.Session)
	defer resp.Close()
	if err != nil {
		log.Println("Error while fetching users from database", err)
		return
	}

	var userIds []map[string]string

	err = resp.All(&userIds)
	log.Println("Loaded " + strconv.Itoa(len(userIds)) + " users")
	for _, u := range userIds {
		calculateStatsForUser(u["id"])
	}
}

func IncrementStat(stat string, userId string) {
	r.Table("user_stats").Get(userId).Update(map[string]interface{}{
		stat: r.Row.Field(stat).Add(1).Default(0),
	}).Exec(db.Session)
}

func IncrementTrophyStat(place int8, userId string) {

	statName := ""
	switch place {
	case 1:
		statName = "goldenTrophies"
	case 2:
		statName = "silverTrophies"
	case 3:
		statName = "bronzeTrophies"
	}

	if statName != "" {
		IncrementStat(statName, userId)
	}
}

func GetStatsForUser(userId string) (map[string]interface{}, bool) {

	resp, err := r.Table("user_stats").Get(userId).Without("userId").Run(db.Session)

	if err != nil || resp.IsNil() {
		return map[string]interface{}{}, false
	}

	var userStats map[string]interface{}
	err = resp.One(&userStats)

	return userStats, true

}
