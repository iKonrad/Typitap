package mail

import (
	"log"

	"github.com/iKonrad/typitap/server/config"
	"github.com/keighl/postmark"
)

var Templates = map[string]int64{
	"NEW_ACCOUNT":    1028961,
	"PASSWORD_RESET": 1495121,
}

var client *postmark.Client

func init() {
	client = postmark.NewClient(config.GetString("mail_server_token"), config.GetString("mail_api_token"));
}

func SendEmail(to string, templateName string, tags map[string]interface{}) bool {

	templateId, ok := Templates[templateName]
	if !ok {
		return false
	}

	email := postmark.TemplatedEmail{
		From:          config.GetString("mail_from_address"),
		To:            to,
		TemplateId:    templateId,
		TemplateModel: tags,
	}
	if config.GetBool("debug") {
		return true
	}
	response, err := client.SendTemplatedEmail(email)

	if err != nil {
		log.Println("Error occurred while sending e-mail", err)
		return false
	}

	log.Println(response)
	return true

}
