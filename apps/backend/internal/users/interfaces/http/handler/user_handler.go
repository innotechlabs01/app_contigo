package handler

import (
	"github.com/gofiber/fiber/v3"

	"github.com/contigo/backend/internal/users/application/usecase"
	"github.com/contigo/backend/pkg/response"
)

type UserHandler struct {
	uc *usecase.UserUseCase
}

func NewUserHandler(uc *usecase.UserUseCase) *UserHandler {
	return &UserHandler{uc: uc}
}

// UpsertMe registers or updates the authenticated user.
func (h *UserHandler) UpsertMe(c fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(string)
	if !ok || userID == "" {
		return response.Unauthorized(c, "Unauthorized")
	}
	var input usecase.UpsertMeInput
	if err := response.ParseBody(c, &input); err != nil {
		return err
	}
	user, err := h.uc.UpsertMe(c.Context(), userID, &input)
	if err != nil {
		return err
	}
	return response.Success(c, fiber.StatusOK, user)
}

// ListCompanions returns the public companion directory.
func (h *UserHandler) ListCompanions(c fiber.Ctx) error {
	companions, err := h.uc.ListCompanions(c.Context())
	if err != nil {
		return err
	}
	return response.Success(c, fiber.StatusOK, companions)
}
