package utils

import (
	"time"
	"os"
)

func GetFileCreated(name string) (mtime time.Time, err error) {

	fi, err := os.Stat(name)
	if err != nil {
		return
	}
	mtime = fi.ModTime()
	return
}