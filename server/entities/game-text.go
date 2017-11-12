package entities

const TEXT_STATUS_REJECTED = 0
const TEXT_STATUS_SUBMITTED = 1
const TEXT_STATUS_ACCEPTED = 2

const TEXT_SOURCE_NONE = ""
const TEXT_SOURCE_BOOK = "book"
const TEXT_SOURCE_MOVIE = "movie"
const TEXT_SOURCE_SONG = "song"
const TEXT_SOURCE_OTHER = "other"

const TEXT_TYPE_NONE = ""
const TEXT_TYPE_ISBN = "ISBN"
const TEXT_TYPE_ASIN = "ASIN"

type GameText struct {
	Id   string `gorethink:"id,omitempty"`
	Text string `gorethink:"text"`
	Status int `gorethink:"status"`
	Language Language `gorethink:"language,reference" gorethink_ref:"id"`
	Source string `gorethink:"source"` // Is this text from a book, movie or something else?
	Type string `gorethink:"type"` // Amazon ID type (ISBN/ASIN etc)
	Code string `gorethink:"code"` // Amazon Code with type specified above
	User User `gorethink:"user,reference" gorethink_ref:"id"`
	IsSubmitted bool `gorethink:"isSubmitted"` // Is this text send through the public form or added by an admin?
}