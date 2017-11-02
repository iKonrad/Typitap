package mail

import (
	"fmt"

	"github.com/iKonrad/typitap/server/config"
	mail "github.com/mailjet/mailjet-apiv3-go"
)

var client *mail.Client

func init() {
	client = mail.NewMailjetClient(config.Config.UString("mail_public_key", ""), config.Config.UString("mail_secret_key", ""))
}

func SendEmail(to string, templateName string, vars map[string]interface{}) bool {

	if !config.Config.UBool("send_emails", false) {
		return true
	}

	fmt.Println("TEMPL", templateName)

	email := &mail.InfoSendMail{
		FromEmail:                config.Config.UString("mail_from_address", "jarson@me.com"),
		FromName:                 "Typitap",
		MjTemplateID:             templateName,
		MjTemplateLanguage:       "true",
		MjTemplateErrorReporting: "jarson@me.com",
		MjTemplateErrorDeliver:   "deliver",
		Recipients: []mail.Recipient{
			{
				Email: to,
				Vars:  vars,
			},
		},
		Vars: vars,
	}

	res, err := client.SendMail(email)
	if err != nil {
		fmt.Println("MAIL ERR", err)
		return false
	} else {
		fmt.Println("MAIL SUCCESS", res)
		return true
	}

}
