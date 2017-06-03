package mail

const (
	TEMPLATE_NEW_ACCOUNT    = "163036"
	TEMPLATE_PASSWORD_RESET = "163083"
)

func TemplateButtonLink(name string, username string, link string) map[string]interface{} {

	return map[string]interface{}{

		"Name":     name,
		"Link":     link,
		"Username": username,

	}

}
