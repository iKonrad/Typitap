package affiliates

import (
	"net/url"

	"log"

	"github.com/dominicphillips/amazing"
	"github.com/iKonrad/typitap/server/config"
)

var client *amazing.Amazing

func init() {
	client, _ = amazing.NewAmazing("US", config.Config.UString("amazon.tag"), config.Config.UString("amazon.access"), config.Config.UString("amazon.secret"))
}

func GetAmazonItemByCode(idType string, id string) (map[string]interface{}, bool) {

	// For now we're supporting only ISBN and ASIN product types.
	if idType != "ISBN" && idType != "ASIN" {
		return map[string]interface{}{}, false
	}

	params := url.Values{
		"IdType":        []string{idType},
		"ItemId":        []string{id},
		"Operation":     []string{"ItemLookup"},
		"ResponseGroup": []string{"Medium"},
	}

	if idType == "ISBN" {
		params["SearchIndex"] = []string{"All"}
	}

	result, err := client.ItemLookup(params)

	if err != nil {
		log.Println("Error while fetching Amazon product", err)
		return map[string]interface{}{}, false
	}

	return map[string]interface{}{
		"url":    result.AmazonItems.Items[0].DetailPageURL,
		"title":  result.AmazonItems.Items[0].ItemAttributes.Title,
		"images": result.AmazonItems.Items[0].ImageSets[0],
	}, len(result.AmazonItems.Items) > 0
}
