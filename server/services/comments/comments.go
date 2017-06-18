package comments


import (
	"github.com/iKonrad/typitap/server/entities"
	r "gopkg.in/gorethink/gorethink.v3"
	db "github.com/iKonrad/typitap/server/services/database"
	"log"
	"github.com/nu7hatch/gouuid"
	"time"
)

func GetComments(channelId string) (entities.Comments, bool) {

	resp, err := r.Table("comments").Get(channelId).Do(func(row r.Term) interface{} {
		return r.Branch(row, row.Merge(func(p r.Term) map[string]interface{}{
			return map[string]interface{}{
				"items": p.Field("items").
					CoerceTo("array").
					OrderBy(r.Desc("created")).
					Merge(func (t r.Term) map[string]interface{}{
					return map[string]interface{}{
						"userId": r.Table("users").Get(t.Field("userId")).Without("password"),
					}
				}),
			}
		}), nil)
	}).Run(db.Session)

	defer resp.Close()

	if err != nil {
		log.Println("Error while fetching channel comments1: ", err)
		return entities.Comments{}, false
	}


	if resp.IsNil() {
		channel := createCommentsChannel(channelId)
		return channel, true
	}

	var channelComments entities.Comments
	err = resp.One(&channelComments)

	if err != nil {
		log.Println("Error while fetching channel comments2: ", err)
		return entities.Comments{}, false
	}

	return channelComments, true

}


func createCommentsChannel(channelId string) entities.Comments {

	channel := entities.Comments{
		ChannelId: channelId,
		Items: []entities.Comment{},
	}

	r.Table("comments").Insert(map[string]interface{}{
			"id": channelId,
			"items": []entities.Comment{},
	}).RunWrite(db.Session)

	return channel

}


func AddComment(channelId string, user entities.User, text string) bool {

	newId, err := uuid.NewV4()

	if err != nil {
		log.Println("Error while adding comment, ", err)
		return false
	}



	comment := entities.Comment{
		Id: newId.String(),
		User: user,
		Created: time.Now(),
		Text: text,
	}



	resp, err := r.Table("comments").Get(channelId).Update(map[string]interface{}{
		"items": r.Row.Field("items").SetUnion([]entities.Comment{comment}),
	}).Run(db.Session)

	defer resp.Close()

	if err != nil {
		log.Println("Error while saving a comment", err)
		return false
	}

	return true

}