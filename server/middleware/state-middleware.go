package middleware

import (
	"github.com/labstack/echo"
	"log"
)

func GenerateStateHandler(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {

		log.Println("PATH:", c.Path())

		return next(c)
	}
}
