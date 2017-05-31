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

	return virtualWords;

}