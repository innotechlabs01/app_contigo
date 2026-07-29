package middleware

import (
	"github.com/gofiber/fiber/v3"
)

// RequestID returns a middleware that adds a request ID to the context.
func RequestID() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Check for existing request ID
		requestID := c.Get("X-Request-ID")
		if requestID == "" {
			requestID = c.Locals("requestid").(string)
		}

		// Set request ID in response header
		c.Set("X-Request-ID", requestID)

		return c.Next()
	}
}
