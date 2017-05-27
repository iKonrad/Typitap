package feed

import (
	"log"
	"time"

	"github.com/iKonrad/typitap/server/entities"
	db "github.com/iKonrad/typitap/server/services/database"
	"github.com/iKonrad/typitap/server/services/logs"
	"github.com/nu7hatch/gouuid"
	r "gopkg.in/gorethink/gorethink.v3"
)

type ActivityActions struct{}

var Activities = ActivityActions{}

func SendActivity(ownerId string, details map[string]string) bool {

	activity, ok := addNewActivity(details)

	if !ok {
		return false
	}

	// Add activity to the user feed
	ok = addActivityToUserFeed(activity.Id, ownerId)
	return ok
}

func SendActivityToFollowers(following string, details map[string]string) bool {

	activity, ok := addNewActivity(details)
	if !ok {
		return false
	}

	followers, ok := GetUserFollowerIds(following)
	log.Println("FOLLOWERS", followers)
	ok = addActivityToUserFeeds(activity.Id, followers)

	return ok
}

func addNewActivity(details map[string]string) (entities.Activity, bool) {

	activityType, ok := details["activityType"]
	delete(details, "activityType")
	if !ok {
		return entities.Activity{}, false
	}

	activity := newActivity()
	aType, ok := getActivityType(activityType)

	if !ok {
		return entities.Activity{}, false
	}

	activity.Type = aType
	activity.Data = details

	_, err := r.Table("activities").Insert(activity).RunWrite(db.Session)
	if err != nil {
		logs.Error("Error while creating activity", "Activity "+activityType+"couldn't be created. Error: "+err.Error(), []string{"error", "activity"}, "Error")
		return entities.Activity{}, false
	}

	return activity, true
}

func addActivityToUserFeeds(activityId string, userIds []interface{}) bool {
	_, err := r.Table("user_feed_activity").GetAll(userIds...).Update(map[string]interface{}{
		"items": r.Row.Field("items").Prepend(activityId),
	}).Run(db.Session)

	if err != nil {
		logs.Error("Error while adding activity to feed", "Activity "+activityId+" couldn't be added to users. Error: "+err.Error(), []string{"error", "activity", "user"}, "Error")
		return false
	}

	return true
}

// Adds activity to a user feed (for example, a follower)
func addActivityToUserFeed(activityId string, userId string) bool {
	_, err := r.Table("user_feed_activity").Get(userId).Update(map[string]interface{}{
		"items": r.Row.Field("items").Prepend(activityId),
	}).RunWrite(db.Session)

	if err != nil {
		logs.Error("Error while adding activity to feed", "Activity "+activityId+"couldn't be added to user "+userId+". Error: "+err.Error(), []string{"error", "activity", "user"}, "Error")
		return false
	}

	return true
}

func getActivityType(typeId string) (entities.ActivityType, bool) {

	res, _ := r.Table("activity_types").Get(typeId).Run(db.Session)
	defer res.Close()

	if res.IsNil() {
		return entities.ActivityType{}, false
	}

	var activity entities.ActivityType
	err := res.One(&activity)
	if err != nil {
		logs.Error("Activity not found", "Couldn't find activity for ID "+typeId, []string{"activity", "user", "error"}, "Error")
		return entities.ActivityType{}, false
	}

	return activity, true
}

func newActivity() entities.Activity {
	newId, _ := uuid.NewV4()
	a := entities.Activity{
		Id:      newId.String(),
		Created: time.Now(),
		Data:    map[string]string{},
	}

	return a
}

func GetFeedForUser(userId string, offset int) (entities.UserFeed, bool) {

	resp, err := r.Table("user_feed_activity").Get(userId).Without("userId").Merge(func(p r.Term) interface{} {
		return map[string]interface{}{
			"items": r.Table("activities").
				GetAll(r.Args(p.Field("items"))).
				OrderBy(r.Desc("created")).
				Skip(offset).
				Limit(5).
				CoerceTo("array").
				Merge(func(s r.Term) interface{} {
					return map[string]interface{}{
						"typeId": r.Table("activity_types").Get(s.Field("typeId")),
					}
				},
				),
		}
	}).Run(db.Session)

	defer resp.Close()

	if err != nil {
		log.Println("Error while fetching feed", err.Error())
		return entities.UserFeed{}, false
	}

	var userFeed entities.UserFeed

	err = resp.One(&userFeed)

	if err != nil {
		log.Println("Error while fetching feed", err.Error())
		return entities.UserFeed{}, false
	}

	return userFeed, true
}

func FollowUser(userId string, followingUser string) {
	resp, err := r.Table("user_feed_follow").Get(userId).Update(map[string]interface{}{
		"following": r.Row.Field("following").SetUnion([]string{followingUser}),
	}).Run(db.Session)
	log.Println(err)
	defer resp.Close()
	resp, err = r.Table("user_feed_follow").Get(followingUser).Update(map[string]interface{}{
		"followers": r.Row.Field("followers").SetUnion([]string{userId}),
	}).Run(db.Session)
	defer resp.Close()
	log.Println(err)
}

func UnfollowUser(userId string, followingUser string) {
	r.Table("user_feed_follow").Get(userId).Update(map[string]interface{}{
		"following": r.Row.Field("following").SetDifference([]string{followingUser}),
	}).Exec(db.Session)
	r.Table("user_feed_follow").Get(followingUser).Update(map[string]interface{}{
		"followers": r.Row.Field("followers").SetDifference([]string{userId}),
	}).Exec(db.Session)
}

func GetUserFollow(userId string) (map[string]interface{}, bool) {

	resp, err := r.Table("user_feed_follow").Get(userId).Without("userId").Merge(func(p r.Term) interface{} {
		return map[string]interface{}{
			"following": r.Table("users").GetAll(r.Args(p.Field("following"))).Without("password", "active", "created").CoerceTo("array"),
			"followers": r.Table("users").GetAll(r.Args(p.Field("followers"))).Without("password", "active", "created").CoerceTo("array"),
		}
	}).Run(db.Session)

	if err != nil || resp.IsNil() {
		return map[string]interface{}{}, false
	}

	var follow map[string]interface{}
	err = resp.One(&follow)

	return follow, true
}

func GetUserFollowerIds(userId string) ([]interface{}, bool) {

	resp, err := r.Table("user_feed_follow").Get(userId).Pluck("followers").Run(db.Session)
	defer resp.Close()

	if err != nil || resp.IsNil() {
		return []interface{}{}, false
	}

	var follow map[string]interface{}
	err = resp.One(&follow)

	if err != nil {
		log.Println(err.Error())
		return []interface{}{}, false
	}

	return follow["followers"].([]interface{}), true
}
