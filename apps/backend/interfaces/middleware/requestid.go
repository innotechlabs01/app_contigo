package middleware

import (
	"github.com/gofiber/fiber/v3"
)

func RequestID() fiber.Handler {
	return func(c fiber.Ctx) error {
		requestID := c.Get("X-Request-ID")
		if requestID == "" {
			requestID = c.Locals("requestid").(string)
		}
		c.Set("X-Request-ID", requestID)
		return c.Next()
	}
}