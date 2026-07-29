package route

import (
	"github.com/contigo/backend/internal/health/interfaces/http/handler"

	"github.com/gofiber/fiber/v3"
)

// Register registers health check routes.
func Register(app *fiber.App, h *handler.HealthHandler) {
	health := app.Group("/health")
	health.Get("/", h.Liveness)
	health.Get("/liveness", h.Liveness)

	readiness := app.Group("/readiness")
	readiness.Get("/", h.Readiness)
}
