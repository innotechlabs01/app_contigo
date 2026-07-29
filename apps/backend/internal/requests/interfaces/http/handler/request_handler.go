package handler

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v3"

	"github.com/contigo/backend/internal/requests/application/usecase"
	"github.com/contigo/backend/pkg/response"
)

type RequestHandler struct {
	uc *usecase.RequestUseCase
}

func NewRequestHandler(uc *usecase.RequestUseCase) *RequestHandler {
	return &RequestHandler{uc: uc}
}

func (h *RequestHandler) Create(c fiber.Ctx) error {
	clientID := c.Locals("user_id").(string)
	var input usecase.CreateRequestInput
	if err := response.ParseBody(c, &input); err != nil {
		return err
	}
	req, err := h.uc.Create(c.Context(), clientID, &input)
	if err != nil {
		return err
	}
	return response.Created(c, req)
}

func (h *RequestHandler) List(c fiber.Ctx) error {
	userID := c.Locals("user_id").(string)
	role := c.Query("role", "client")
	var reqs interface{}
	var err error
	if role == "companion" {
		reqs, err = h.uc.ListByCompanion(c.Context(), userID)
	} else {
		reqs, err = h.uc.ListByClient(c.Context(), userID)
	}
	if err != nil {
		return err
	}
	return response.Success(c, fiber.StatusOK, reqs)
}

func (h *RequestHandler) GetByID(c fiber.Ctx) error {
	id := c.Params("id")
	req, err := h.uc.GetByID(c.Context(), id)
	if err != nil {
		return err
	}
	return response.Success(c, fiber.StatusOK, req)
}

func (h *RequestHandler) Accept(c fiber.Ctx) error {
	id := c.Params("id")
	companionID := c.Locals("user_id").(string)
	req, err := h.uc.Accept(c.Context(), id, companionID)
	if err != nil {
		return err
	}
	return response.Success(c, fiber.StatusOK, req)
}

func (h *RequestHandler) Reject(c fiber.Ctx) error {
	id := c.Params("id")
	companionID := c.Locals("user_id").(string)
	req, err := h.uc.Reject(c.Context(), id, companionID)
	if err != nil {
		return err
	}
	return response.Success(c, fiber.StatusOK, req)
}

func (h *RequestHandler) HandleWS(c *websocket.Conn) {
	userID := c.Locals("user_id").(string)
	h.uc.Hub.Register(userID, c)
	defer h.uc.Hub.Unregister(userID, c)

	for {
		_, _, err := c.ReadMessage()
		if err != nil {
			break
		}
	}
}
