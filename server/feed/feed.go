package feed

import (
	"time"

	db "github.com/iKonrad/typitap/server/database"
	"github.com/iKonrad/typitap/server/entities"
	"github.com/iKonrad/typitap/server/logs"
	"github.com/nu7hatch/gouuid"
	r "gopkg.in/gorethink/gorethink.v3"
)

type ActivityActions struct{}

var Activities = ActivityActions{}

func SendActivity(ownerId string, details map[string]string) bool {

	activityType, ok := details["activityType"]
	delete(details, "activityType");
	if !ok {
		return false
	}

	activity := newActivity()
	aType, ok := getActivityType(activityType)

	if !ok {
		return false
	}

	activity.Type = aType
	activity.Data = details

	// @TODO: Send activity to followers

	_, err := r.Table("activities").Insert(activity).RunWrite(db.Session)
	if err != nil {
		logs.Error("Error while creating activity", "Activity "+activityType+"couldn't be created. Error: "+err.Error(), []string{"error", "activity"}, "Error")
		return false
	}

	// Add activity to the user feed
	ok = addActivityToUserFeed(activity.Id, ownerId)
	return ok
}

// Adds activity to a user feed (for example, a follower)
func addActivityToUserFeed(activityId string, userId string) bool {
	_, err := r.Table("user_activity_feed").Get(userId).Update(map[string]interface{}{
		"items": r.Row.Field("items").Append(activityId),
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
