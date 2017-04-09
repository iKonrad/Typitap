package manager

import (
	"github.com/keighl/postmark"
	"github.com/iKonrad/typitap/server/config"
)

type MailManager struct {
	Client *postmark.Client
}

var Mail MailManager;

func init() {

	Mail = MailManager{
		Client: postmark.NewClient(config.GetString("mail_server_token"), config.GetString("mail_api_token")),
	}


	//email := postmark.Email{
	//	From: "noreply@typitap.com",
	//	To: "jarson@me.com",
	//	Subject: "Reset your password",
	//	HtmlBody: "...",
	//	TextBody: "...",
	//	Tag: "pw-reset",
	//	TrackOpens: true,
	//}
	//
	//_, err := Mail.Client.SendEmail(email)
	//if err != nil {
	//	panic(err)
	//}

}