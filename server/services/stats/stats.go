package stats

import (
	"log"

	"time"

	"github.com/iKonrad/typitap/server/entities"
	db "github.com/iKonrad/typitap/server/services/database"
	r "gopkg.in/gorethink/gorethink.v3"
	"strconv"
	"github.com/iKonrad/typitap/server/services/utils"
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

	log.Println("Calculated for ", userId, ", ", averageAccuracy, averageWpm)

	r.Table("user_stats").Get(userId).Update(map[string]interface{}{
		"wpm":      averageWpm,
		"accuracy": averageAccuracy,
	}).Exec(db.Session)
}

func CalculateAllStats() {
	resp, err := r.Table("users").Pluck("id").Run(db.Session)
	defer resp.Close()
	if err != nil {
		return
	}

	var userIds []map[string]interface{}

	err = resp.All(&userIds)
	log.Println("Found users: ", len(userIds))
	for _, u := range userIds {
		calculateStatsForUser(u["id"].(string))
	}
}

func CalculateStats() {
	// Get all users that have played the game within the last hour
	nowDate := time.Now()
	hourAgoDate := time.Now().Add(time.Duration(-1 * time.Hour))

	resp, err := r.Table("game_results").Pluck("userId", "created").Filter(func(row r.Term) r.Term {
		hourAgoRDate := r.Time(hourAgoDate.Year(), hourAgoDate.Month(), hourAgoDate.Day(), hourAgoDate.Hour(), hourAgoDate.Minute(), hourAgoDate.Second(), "Z")
		nowRDate := r.Time(nowDate.Year(), nowDate.Month(), nowDate.Day(), nowDate.Hour(), nowDate.Minute(), nowDate.Second(), "Z")
		return row.Field("created").During(hourAgoRDate, nowRDate)
	}).Run(db.Session)

	defer resp.Close()
	if err != nil || resp.IsNil() {
		return
	}

	var gameResults []map[string]interface{}
	err = resp.All(&gameResults)

	usersCalculated := []string{}

	// Go through all game results and run stats calculation for users
	for _, u := range gameResults {
		userFound := false
		// Don't recalculate users several times if they have multiple results
		for _, res := range usersCalculated {
			if res == u["userId"].(string) {
				userFound = true
				break
			}
		}

		if !userFound {
			calculateStatsForUser(u["userId"].(string))
			usersCalculated = append(usersCalculated, u["userId"].(string))
		}
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

func GetChartStatsForUser(userId string) (map[string]interface{}, bool) {
	resp, err := r.Table("game_results").
		Filter(map[string]interface{}{"userId": userId}).
		Pluck("created", "wpm", "accuracy").
		Group(r.Row.Field("created").Year(), r.Row.Field("created").Month(), r.Row.Field("created").Day()).
		Run(db.Session)

	if err != nil || resp.IsNil() {
		return map[string]interface{}{}, false
	}

	var userStats []map[string]interface{}
	err = resp.All(&userStats)

	returnStats := map[string]interface{}{}

	// Go through all results and calculate average wpm/accuracy
	for _, dayStats := range userStats {
		sumWpm := 0
		sumAccuracy := 0
		gamesPlayed := 0

		for _, stat := range dayStats["reduction"].([]interface{}) {
			convStat := stat.(map[string]interface{})
			sumWpm += int(convStat["wpm"].(float64))
			sumAccuracy += int(convStat["accuracy"].(float64))
			gamesPlayed++
		}

		dayIndex := dayStats["group"].([]interface{})
		dayIndexText := strconv.Itoa(int(dayIndex[0].(float64))) + "-" + utils.LeftPad(strconv.Itoa(int(dayIndex[1].(float64))), "0", 2) + "-" + strconv.Itoa(int(dayIndex[2].(float64)))
		returnStats[dayIndexText] = map[string]interface{}{
			"wpm": int(float64(sumWpm) / float64(gamesPlayed)),
			"accuracy": int(float64(sumAccuracy) / float64(gamesPlayed)),
		}
	}

	return returnStats, true
}
