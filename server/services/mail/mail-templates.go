package mail

const (
	TEMPLATE_NEW_ACCOUNT    = "163036"
	TEMPLATE_PASSWORD_RESET = "163083"
	TEMPLATE_CHANGE_EMAIL   = "164463"
	TEMPLATE_TEXT_ACCEPTED  = "243087"
)

func TemplateButtonLink(name string, username string, link string) map[string]interface{} {
	return map[string]interface{}{
		"Name":     name,
		"Link":     link,
		"Username": username,
	}
}

func TemplateTextAccepted(name string, username string, text string) map[string]interface{} {
	return map[string]interface{}{
		"Name":     name,
		"Text":     text,
		"Username": username,
	}
}
