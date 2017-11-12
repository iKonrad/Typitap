package controller

import (
	"github.com/iKonrad/typitap/server/services/affiliates"
	"github.com/iKonrad/typitap/server/services/gametexts"
	"github.com/labstack/echo"
)

type AffiliatesAPIController struct {
}

var AffiliatesAPI AffiliatesAPIController

func init() {
	AffiliatesAPI = AffiliatesAPIController{}
}

func (gc *AffiliatesAPIController) GetAmazonProductForText(c echo.Context) error {
	textId := c.Param("id")
	text, ok := gametexts.GetText(textId)

	if ok && text.Type != "" && text.Code != "" {
		product, ok := affiliates.GetAmazonItemByCode(text.Type, text.Code)

		if ok {
			product["source"] = text.Source
			return c.JSON(200, map[string]interface{}{
				"success": ok,
				"data": product,
			})
		}

	}

	return c.JSON(200, map[string]interface{}{
		"success": false,
		"data":    map[string]interface{}{},
	})
}
