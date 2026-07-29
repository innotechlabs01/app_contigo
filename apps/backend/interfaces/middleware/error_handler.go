package middleware

import (
	"github.com/contigo/backend/pkg/logger"
	"github.com/contigo/backend/pkg/response"

	"github.com/gofiber/fiber/v3"
	"go.uber.org/zap"
)

// ErrorHandler returns a middleware that handles errors uniformly.
func ErrorHandler() fiber.Handler {
	return func(c fiber.Ctx) error {
		err := c.Next()
		if err != nil {
			// Log the error
			l := logger.FromContext(c.Context())
			l.Error("Request error",
				zap.Error(err),
				zap.String("method", c.Method()),
				zap.String("path", c.Path()),
			)

			// Return standardized error response
			if e, ok := err.(*fiber.Error); ok {
				return response.ErrorWithStatus(c, e.Code, "ERROR", e.Message)
			}
			return response.Internal(c, "Internal server error")
		}
		return nil
	}
}
