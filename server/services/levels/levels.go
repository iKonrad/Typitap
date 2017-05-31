package levels

import (
	"github.com/iKonrad/typitap/server/entities"
	db "github.com/iKonrad/typitap/server/services/database"
	"github.com/iKonrad/typitap/server/services/utils"
	r "gopkg.in/gorethink/gorethink.v3"
)

const POINT_BASE = 1
const ONLINE_MULTIPLIER = 1.1
const LEVEL_EXP_BASE = 200
const LEVEL_EXP_MULTIPLIER = 100

var Levels []entities.Level

func init() {

	// Fetch level data from database

	resp, err := r.Table("levels").Run(db.Session)
	defer resp.Close()

	if err != nil || resp.IsNil() {
		panic(err)
	}

	Levels = []entities.Level{}

	err = resp.All(&Levels)

	if err != nil {
		panic(err)
	}

}
// Calculates how many points should a user get for the game result
// (Words * PB) * wpmMultiplier * Accuracy
func CalculatePoints(result *entities.GameResult, players int) int {

	var points float32
	points = 0

	// First, get count of virtual words
	virtualWords := utils.WordsCount(result.Session.Text.Text)

	// Multiply by a point base, to give ourselves a bit more flexiblity
	points = float32(virtualWords) * POINT_BASE


	// Get and apply multipliers
	wpmMultiplier := getWpmMultiplier(result.WPM)
	accuracyMultiplier := float32(result.Accuracy) / 100

	points = float32(points) * wpmMultiplier
	points = float32(points) * accuracyMultiplier

	if result.Session.Online {
		// Apply online multiplier
		points = float32(points) * ONLINE_MULTIPLIER

		// Apply place multiplier
		placeMultiplier := getPlaceMultiplier(result.Place, players)
		points = points * placeMultiplier
	}

	return int(points)
}

// Applies points to the user.
// Returns: (bool) leveledUp, (bool) ok
func ApplyPoints(user *entities.User, points int) (bool, bool) {

	// Get next level threshold
	nextThreshold := CalculateThresholdForLevel(user.Level + 1)
	leveledUp := false

	// Check if user should level up
	if (user.Exp + points) > nextThreshold  {
		// User should level up
		nextExp := (nextThreshold - (user.Exp + points)) * -1
		user.Level++
		user.Exp = nextExp
		leveledUp = true
	} else {
		user.Exp = user.Exp + points
	}

	updateUser(user)
	return leveledUp, true
}

func CalculateThresholdForLevel(level int) int {

	/*
		X = X * BASE + (([X - 1] * [X - 1] * MULTIPLIER))

		1 = 1 * 200 + 0 * 100 = 200
		2 = 2 * 200 + 1 * 100 * 1 = 500
		3 = 3 * 200 + (2 * 100 * 2) = 1000
		4 = 4 * 200 + 3 * 3 * 100 = 1700
		5 = 5 * 200 + 4 * 100 =
	*/

	l := level - 1
	var lm int
	if l < 1 {
		lm = 0
	} else {
		lm = l - 1
	}

	exp := (l * LEVEL_EXP_BASE) + (lm * lm * LEVEL_EXP_MULTIPLIER)

	if exp < 0 {
		return 0
	} else {
		return exp
	}

}

func updateUser(user *entities.User) {
	r.Table("users").Get(user.Id).Update(map[string]interface{}{
		"level": user.Level,
		"exp":   user.Exp,
	}).Exec(db.Session)
}

func getUserExp(userId string) (int, bool) {
	resp, err := r.Table("users").Get(userId).Pluck("exp").Run(db.Session)
	defer resp.Close()

	if err != nil || resp.IsNil() {
		return 0, false
	}

	var points interface{}
	err = resp.One(&points)

	if err != nil || resp.IsNil() {
		return 0, false
	}

	return points.(int), true
}

func getWpmMultiplier(wpm int) float32 {
	var multiplier float32
	multiplier = float32(wpm) / 100.00
	multiplier = multiplier + 1
	return multiplier
}

func getPlaceMultiplier(place int, players int) float32 {
	var diff float32
	diff = float32(players - place)
	diff = diff / 10
	diff = diff + 1
	return diff
}
