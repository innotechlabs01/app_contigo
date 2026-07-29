package route

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v3"

	"github.com/contigo/backend/internal/requests/interfaces/http/handler"
)

func Register(v1 fiber.Router, h *handler.RequestHandler) {
	requests := v1.Group("/requests")
	requests.Post("/", h.Create)
	requests.Get("/", h.List)
	requests.Get("/:id", h.GetByID)
	requests.Post("/:id/accept", h.Accept)
	requests.Post("/:id/reject", h.Reject)

	v1.Get("/ws", websocket.New(h.HandleWS, websocket.Config{
		Filter: func(c fiber.Ctx) bool {
			return true
		},
	}))
}
