package feed

func (a ActivityActions) UserFollows(follower string, following string) map[string]string {

	return map[string]string{
		"activityType": "USER_FOLLOWS",
		"follower":     follower,
		"following":    following,
	}
}

func (a ActivityActions) UserFollowsYou(follower string) map[string]string {

	return map[string]string{
		"activityType": "USER_FOLLOWS_YOU",
		"follower":     follower,
	}
}
