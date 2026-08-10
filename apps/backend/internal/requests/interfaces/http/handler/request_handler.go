package handler

import (
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

// currentUserID returns the authenticated user id set by the auth middleware.
func currentUserID(c fiber.Ctx) (string, error) {
	userID, ok := c.Locals("user_id").(string)
	if !ok || userID == "" {
		return "", response.Unauthorized(c, "Unauthorized")
	}
	return userID, nil
}

func (h *RequestHandler) Create(c fiber.Ctx) error {
	clientID, err := currentUserID(c)
	if err != nil {
		return err
	}
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
	userID, err := currentUserID(c)
	if err != nil {
		return err
	}
	isCompanion, err := h.uc.IsCompanionUser(c.Context(), userID)
	if err != nil {
		return err
	}
	var reqs interface{}
	if isCompanion {
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
	userID, err := currentUserID(c)
	if err != nil {
		return err
	}
	req, err := h.uc.GetByID(c.Context(), id, userID)
	if err != nil {
		return err
	}
	return response.Success(c, fiber.StatusOK, req)
}

func (h *RequestHandler) Accept(c fiber.Ctx) error {
	id := c.Params("id")
	companionID, err := currentUserID(c)
	if err != nil {
		return err
	}
	req, err := h.uc.Accept(c.Context(), id, companionID)
	if err != nil {
		return err
	}
	return response.Success(c, fiber.StatusOK, req)
}

func (h *RequestHandler) Reject(c fiber.Ctx) error {
	id := c.Params("id")
	companionID, err := currentUserID(c)
	if err != nil {
		return err
	}
	req, err := h.uc.Reject(c.Context(), id, companionID)
	if err != nil {
		return err
	}
	return response.Success(c, fiber.StatusOK, req)
}

func (h *RequestHandler) Cancel(c fiber.Ctx) error {
	id := c.Params("id")
	userID, err := currentUserID(c)
	if err != nil {
		return err
	}
	req, err := h.uc.Cancel(c.Context(), id, userID)
	if err != nil {
		return err
	}
	return response.Success(c, fiber.StatusOK, req)
}
