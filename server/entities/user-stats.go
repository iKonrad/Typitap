package entities


type UserStats struct {
	User User `gorethink:"userId,reference" gorethink_ref:"id"`
	WPM int `gorethink:"wpm"`
	Accuracy int `gorethink:"accuracy"`
	GoldenTrophies int `gorethink:"goldenTrophies"`
	SilverTrophies int `gorethink:"silverTrophies"`
	BronzeTrophies int `gorethink:"bronzeTrophies"`
	GamesPlayed int `gorethink:"gamesPlayed"`
}