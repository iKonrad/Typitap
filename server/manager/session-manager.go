package manager

import (
	"github.com/pkg/errors"
)

type SessionManager struct {
	sessions map[string]string
}

var Session SessionManager;


func init() {
	Session = SessionManager{
		sessions: make(map[string]string),
	}
}


func (sm SessionManager) RetrieveToken(token string) (string, error) {

	for index, element := range sm.sessions {
		if index == token {
			return element, nil
		}
	}

	return "", errors.New("Token not found")
}

func (sm SessionManager) RemoveSession(token string)  {

	if _, ok := sm.sessions[token]; ok {
		delete(sm.sessions, token);
	}
}


func (sm SessionManager) CreateSession(token string, value string) {

	if _, ok := sm.sessions[token]; !ok {
		sm.sessions[token] = value;
	}

}