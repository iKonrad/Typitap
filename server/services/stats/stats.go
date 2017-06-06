package stats

import (
	"log"

	"github.com/iKonrad/typitap/server/entities"
	db "github.com/iKonrad/typitap/server/services/database"
	r "gopkg.in/gorethink/gorethink.v3"
)

func NewStats(user entities.User) entities.UserStats {
	return entities.UserStats{
		User:           user,
		WPM:            0,
		Accuracy:       0,
		GoldenTrophies: 0,
		SilverTrophies: 0,
		BronzeTrophies: 0,
		GamesPlayed:    0,
	}
}

func calculateStatsForUser(userId string) {

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

	// No returns, we can stop the function
	if len(results) == 0 {
		return
	}

	var sumWpm int
	var sumAccuracy int
	for _, result := range results {
		sumWpm += int(result["wpm"].(float64))
		sumAccuracy += int(result["accuracy"].(float64))
	}

	averageWpm := int(float32(sumWpm) / float32(len(results)))
	averageAccuracy := int(float32(sumAccuracy) / float32(len(results)))

	r.Table("user_stats").Get(userId).Update(map[string]interface{}{
		"wpm":      averageWpm,
		"accuracy": averageAccuracy,
	}).Exec(db.Session)
}

func CalculateStats() {

	resp, err := r.Table("users").Pluck("id").Run(db.Session)
	defer resp.Close()
	if err != nil {
		return
	}

	var userIds []map[string]string

	err = resp.All(&userIds)
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

func IncrementGamesStat(userId string) {
	IncrementStat("gamesPlayed", userId)
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
