package feed

import "strconv"

func (a ActivityActions) PlayerCompletedOnlineGameActivity(username string, place int, wpm int) map[string]string {

	return map[string]string{
		"activityType": "GAME_FINISHED_ONLINE_RACE",
		"user":         username,
		"place":        strconv.Itoa(place),
		"wpm":          strconv.Itoa(wpm),
	}
}

func (a ActivityActions) PlayerCompletedOfflineGameActivity(username string, wpm int) map[string]string {
	return map[string]string{
		"activityType": "GAME_FINISHED_OFFLINE_RACE",
		"user":         username,
		"wpm":          strconv.Itoa(wpm),
	}
}

func (a ActivityActions) GuestCompletedGameActivity(wpm int) map[string]string {
	return map[string]string{
		"activityType": "GAME_FINISHED_OFFLINE_RACE_GUEST",
		"wpm":          strconv.Itoa(wpm),
	}
}


func (a ActivityActions) GlobalGameFinished(username string, wpm int, players int) map[string]string {
	return map[string]string{
		"activityType": "GLOBAL_GAME_FINISHED",
		"user":         username,
		"players":      strconv.Itoa(players),
		"wpm":          strconv.Itoa(wpm),
	}
}

func (a ActivityActions) PlayerMakesToTopChart(username string, wpm int) map[string]string {
	return map[string]string{
		"activityType": "GAME_FINISHED_RACE_CHART",
		"user":         username,
		"wpm":          strconv.Itoa(wpm),
	}
}
