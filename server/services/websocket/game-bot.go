package websocket

import (
	"time"
	"math/rand"
)

const TYPE_BOT_EASY = 1
const TYPE_BOT_MEDIUM = 2
const TYPE_BOT_HARD = 3
const TYPE_BOT_SUPER_HARD = 4
const TYPE_BOT_WPM_MULTIPLIER = 30

type Bot struct {
	Difficulty int
	Identifier string
	WPM int
	Finished bool
}

func NewBot(identifier string, difficulty int) Bot {
	wpm := difficulty * TYPE_BOT_WPM_MULTIPLIER
	rand.Seed(time.Now().Unix())
	wpm = wpm + (rand.Intn(10+10) - 10)

	bot := Bot {
		Identifier: identifier,
		Difficulty: difficulty,
		WPM: wpm,
		Finished: false,
	}
	return bot
}

// Based on WPM, calculate at which word should the bot be for a given time
func (b *Bot) calculateScoreForTime(time int) int {
	wordsPerSecond := float64(0)
	wordsPerSecond = float64(b.WPM) / float64(60)
	currentWords := float64(time) * wordsPerSecond
	return int(currentWords)
}
