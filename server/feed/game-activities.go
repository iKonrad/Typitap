package feed

import "strconv"

func (a ActivityActions) PlayerCompletedOnlineGameActivity(username string, place int, wpm int) map[string]string {

	return map[string]string {
		"activityType": "GAME_FINISHED_ONLINE_RACE",
		"user": username,
		"place": strconv.Itoa(place),
		"wpm": strconv.Itoa(wpm),
	}
}

func (a ActivityActions) PlayerCompletedOfflineGameActivity(username string, wpm int) map[string]string {
	return map[string]string {
		"activityType": "GAME_FINISHED_OFFLINE_RACE",
		"user": username,
		"wpm": strconv.Itoa(wpm),
	}
}

