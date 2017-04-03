package authentication

import (
	"github.com/gorilla/securecookie"
	"net/http"
)



type CookieManager struct {
	hashKey []byte
	blockKey []byte
	secureCookie *securecookie.SecureCookie
}



func newCookieManager() CookieManager {

	hashKey := securecookie.GenerateRandomKey(16)
	blockKey := securecookie.GenerateRandomKey(16)

	cookieManager := CookieManager{
		hashKey: hashKey,
		blockKey: nil,
		secureCookie:
		securecookie.New(hashKey, blockKey),
	};
	return cookieManager;
}


// DecodeCookie decodes the cookie and returns the decoded value as a string
func (cm CookieManager) DecodeCookie(cookie *http.Cookie) (string, error) {
	var value string;
	err := cm.secureCookie.Decode(cookie.Name, cookie.Value, &value);

	return value, err;

}


// CreateCookie creates a secure cookie with gorilla securecookies
func (cm CookieManager) CreateCookie(cookieName string, cookieValue string) (*http.Cookie, error) {



	encoded, err := cm.secureCookie.Encode(cookieName, cookieValue)

	if err == nil {
		cookie := http.Cookie{
			Name:  cookieName,
			Value: encoded,
			Path:  "/",
		}

		return &cookie, nil
	}

	return nil, err;

}