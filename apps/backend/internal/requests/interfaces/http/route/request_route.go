package route

import (
	"github.com/gofiber/fiber/v3"

	"github.com/contigo/backend/internal/requests/interfaces/http/handler"
	"github.com/contigo/backend/internal/requests/ws"
)

func Register(v1 fiber.Router, h *handler.RequestHandler, hub *ws.Hub) {
	requests := v1.Group("/requests")
	requests.Get("/ws", hub.HandleWebSocket())
	requests.Post("/", h.Create)
	requests.Get("/", h.List)
	requests.Get("/:id", h.GetByID)
	requests.Post("/:id/accept", h.Accept)
	requests.Post("/:id/reject", h.Reject)
	requests.Post("/:id/cancel", h.Cancel)
}
