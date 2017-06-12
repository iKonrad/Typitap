package utils

import (
	"time"
	"os"
	"syscall"
	"github.com/iKonrad/typitap/server/config"
)

func StatTimes(name string) (atime, mtime, ctime time.Time, err error) {

	fi, err := os.Stat(name)
	if err != nil {
		return
	}
	mtime = fi.ModTime()
	stat := fi.Sys().(*syscall.Stat_t)

		//atime = time.Unix(int64(stat.Atimespec.Sec), int64(stat.Atimespec.Nsec))
		//ctime = time.Unix(int64(stat.Ctimespec.Sec), int64(stat.Ctimespec.Nsec))

		atime = time.Unix(int64(stat.Atim.Sec), int64(stat.Atim.Nsec))
		ctime = time.Unix(int64(stat.Ctim.Sec), int64(stat.Ctim.Nsec))



	return
}