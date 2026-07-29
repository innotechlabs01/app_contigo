package middleware

import (
	"github.com/contigo/backend/pkg/response"

	"github.com/gofiber/fiber/v3"
)

// Recovery returns a middleware that recovers from panics.
func Recovery() fiber.Handler {
	return func(c fiber.Ctx) error {
		defer func() {
			if r := recover(); r != nil {
				_ = response.Internal(c, "Internal server error")
			}
		}()
		return c.Next()
	}
}
