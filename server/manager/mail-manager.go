package manager

import (
	"github.com/keighl/postmark"
	"github.com/iKonrad/typitap/server/config"
	"log"
)


var Templates = map[string]int64 {
	"NEW_ACCOUNT": 1028961,
}

type MailManager struct {
	client *postmark.Client
}

var Mail MailManager;

func init() {

	Mail = MailManager{
		client: postmark.NewClient(config.GetString("mail_server_token"), config.GetString("mail_api_token")),
	}

}


func (m MailManager) SendEmail(to string, templateName string, tags map[string]interface{}) bool {

	templateId, ok := Templates[templateName];

	if !ok {
		return false
	}



	email := postmark.TemplatedEmail{
		From: config.GetString("mail_from_address"),
		To: to,
		TemplateId: templateId,
		TemplateModel: tags,
	};

	if config.GetBool("debug") {
		return true
	}
	response, err := m.client.SendTemplatedEmail(email)

	if err != nil {
		log.Println("Error occurred while sending e-mail", err)
		return false;
	}

	log.Println(response)
	return true

}