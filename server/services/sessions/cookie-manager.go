package sessions

import (
	"net/http"

	"github.com/gorilla/securecookie"
)

var hashKey []byte
var blockKey []byte
var secureCookie *securecookie.SecureCookie

func init() {

	hashKey := securecookie.GenerateRandomKey(16)
	blockKey := securecookie.GenerateRandomKey(16)

	hashKey = hashKey
	blockKey = nil
	secureCookie = securecookie.New(hashKey, blockKey)
}

// DecodeCookie decodes the cookie and returns the decoded value as a string
func DecodeCookie(cookie *http.Cookie) (string, error) {
	var value string
	err := secureCookie.Decode(cookie.Name, cookie.Value, &value)

	return value, err

}

// CreateCookie creates a secure cookie with gorilla securecookies
func CreateCookie(cookieName string, cookieValue string) (*http.Cookie, error) {

	encoded, err := secureCookie.Encode(cookieName, cookieValue)
	if err == nil {
		cookie := http.Cookie{
			Name:  cookieName,
			Value: encoded,
			Path:  "/",
		}

		return &cookie, nil
	}

	return nil, err

}
