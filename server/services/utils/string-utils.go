package utils

import "strings"

func WordsCount(text string) int {

	// Remove spaces form the text
	oneString := strings.Replace(text, " ", "", -1)

	// Count number of characters in a string
	characters := len([]rune(oneString))

	// Divide the text by 5 to get number of average words
	virtualWords := int(characters / 5)

	if (characters % 5) > 2 {
		virtualWords++
	}

	return virtualWords

}


func RightPad(s string, padStr string, overallLen int) string{
	var padCountInt int
	padCountInt = 1 + ((overallLen-len(padStr))/len(padStr))
	var retStr =  s + strings.Repeat(padStr, padCountInt)
	return retStr[:overallLen]
}

func LeftPad(s string, padStr string, overallLen int) string{
	var padCountInt int
	padCountInt = 1 + ((overallLen-len(padStr))/len(padStr))
	var retStr = strings.Repeat(padStr, padCountInt) + s
	return retStr[(len(retStr)-overallLen):]
}