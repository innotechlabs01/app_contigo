package handler

import (
	"github.com/contigo/backend/infrastructure/database/turso"
	"github.com/contigo/backend/pkg/response"

	"github.com/gofiber/fiber/v3"
)

// HealthHandler handles health check endpoints.
type HealthHandler struct {
	pool turso.Pool
}

// NewHealthHandler creates a new HealthHandler.
func NewHealthHandler(pool turso.Pool) *HealthHandler {
	return &HealthHandler{pool: pool}
}

// Liveness handles GET /health
// Returns 200 OK if the server is running.
func (h *HealthHandler) Liveness(c fiber.Ctx) error {
	return response.Success(c, fiber.StatusOK, fiber.Map{
		"status": "alive",
	})
}

// Readiness handles GET /readiness
// Returns 200 OK if all dependencies are available, 503 otherwise.
func (h *HealthHandler) Readiness(c fiber.Ctx) error {
	ctx := c.Context()

	// Check database connectivity
	if err := h.pool.Ping(ctx); err != nil {
		return response.ErrorWithStatus(c, fiber.StatusServiceUnavailable,
			"SERVICE_UNAVAILABLE", "Database is not reachable")
	}

	return response.Success(c, fiber.StatusOK, fiber.Map{
		"status": "ready",
	})
}
