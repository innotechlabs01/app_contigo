package route

import (
	"github.com/gofiber/fiber/v3"

	"github.com/contigo/backend/internal/users/interfaces/http/handler"
)

func Register(v1 fiber.Router, h *handler.UserHandler) {
	users := v1.Group("/users")
	users.Post("/me", h.UpsertMe)

	v1.Get("/companions", h.ListCompanions)
}
