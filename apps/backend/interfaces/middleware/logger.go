package middleware

import (
	"github.com/contigo/backend/pkg/logger"

	"github.com/gofiber/fiber/v3"
	"go.uber.org/zap"
)

// Logger returns a middleware that logs requests using Zap.
func Logger() fiber.Handler {
	return func(c fiber.Ctx) error {
		requestID := c.Get("X-Request-ID")
		if requestID == "" {
			if rid := c.Locals("requestid"); rid != nil {
				requestID = rid.(string)
			}
		}

		// Add correlation ID to logger
		l := logger.With(zap.String("request_id", requestID))
		ctx := logger.ToContext(c.Context(), l)
		c.SetContext(ctx)

		// Log request
		l.Info("Request started",
			zap.String("method", c.Method()),
			zap.String("path", c.Path()),
			zap.String("ip", c.IP()),
		)

		// Continue
		err := c.Next()

		// Log response
		l.Info("Request completed",
			zap.Int("status", c.Response().StatusCode()),
			zap.String("method", c.Method()),
			zap.String("path", c.Path()),
		)

		return err
	}
}
