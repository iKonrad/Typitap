package entities

type GameChart struct {
	Id    string       `gorethink:"id,omitempty"`
	Items []GameResult `gorethink:"items,reference" gorethink_ref:"id"`
}
