package usecase

import (
	"context"
	"time"

	"github.com/contigo/backend/internal/requests/domain/entity"
	"github.com/contigo/backend/internal/requests/domain/repository"
	"github.com/contigo/backend/internal/requests/ws"
	apperr "github.com/contigo/backend/pkg/errors"
	"github.com/google/uuid"
)

type RequestUseCase struct {
	repo repository.RequestRepository
	Hub  *ws.Hub
}

func NewRequestUseCase(repo repository.RequestRepository, hub *ws.Hub) *RequestUseCase {
	if hub == nil {
		hub = ws.NewHub()
	}
	return &RequestUseCase{repo: repo, Hub: hub}
}

type CreateRequestInput struct {
	ServiceType   string  `json:"service_type" validate:"required"`
	FullName      string  `json:"full_name" validate:"required"`
	Phone         string  `json:"phone" validate:"required"`
	Address       string  `json:"address" validate:"required"`
	MeetingPoint  *string `json:"meeting_point,omitempty"`
	PreferredDate string  `json:"preferred_date" validate:"required"`
	Notes         *string `json:"notes,omitempty"`
}

func (uc *RequestUseCase) Create(ctx context.Context, clientID string, input *CreateRequestInput) (*entity.ServiceRequest, error) {
	now := time.Now()
	req := &entity.ServiceRequest{
		ID:            uuid.New().String(),
		ClientID:      clientID,
		ServiceType:   input.ServiceType,
		FullName:      input.FullName,
		Phone:         input.Phone,
		Address:       input.Address,
		MeetingPoint:  input.MeetingPoint,
		PreferredDate: input.PreferredDate,
		Notes:         input.Notes,
		Status:        "pending",
		CreatedAt:     now,
		UpdatedAt:     now,
	}

	if err := uc.repo.Create(ctx, req); err != nil {
		return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "failed to create request")
	}

	if uc.Hub != nil {
		uc.Hub.Broadcast(ws.Message{
			Type: "request_created",
			Data: req,
		})
	}

	return req, nil
}

func (uc *RequestUseCase) GetByID(ctx context.Context, id string) (*entity.ServiceRequest, error) {
	req, err := uc.repo.GetByID(ctx, id)
	if err != nil {
		return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "failed to get request")
	}
	if req == nil {
		return nil, apperr.ErrNotFound
	}
	return req, nil
}

func (uc *RequestUseCase) ListByClient(ctx context.Context, clientID string) ([]*entity.ServiceRequest, error) {
	reqs, err := uc.repo.ListByClient(ctx, clientID)
	if err != nil {
		return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "failed to list requests")
	}
	return reqs, nil
}

func (uc *RequestUseCase) ListByCompanion(ctx context.Context, companionID string) ([]*entity.ServiceRequest, error) {
	reqs, err := uc.repo.ListByCompanion(ctx, companionID)
	if err != nil {
		return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "failed to list requests")
	}
	return reqs, nil
}

func (uc *RequestUseCase) ListPending(ctx context.Context) ([]*entity.ServiceRequest, error) {
	reqs, err := uc.repo.ListPending(ctx)
	if err != nil {
		return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "failed to list pending requests")
	}
	return reqs, nil
}

func (uc *RequestUseCase) Accept(ctx context.Context, id, companionID string) (*entity.ServiceRequest, error) {
	req, err := uc.repo.GetByID(ctx, id)
	if err != nil {
		return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "failed to get request")
	}
	if req == nil {
		return nil, apperr.ErrNotFound
	}
	if req.Status != "pending" {
		return nil, apperr.New(apperr.ErrCodeBadRequest, "request is not pending")
	}

	if err := uc.repo.UpdateStatus(ctx, id, "accepted", companionID); err != nil {
		return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "failed to update request")
	}

	req.Status = "accepted"
	req.CompanionID = companionID

	if uc.Hub != nil {
		uc.Hub.SendToUser(req.ClientID, ws.Message{
			Type: "request_accepted",
			Data: req,
		})
	}

	return req, nil
}

func (uc *RequestUseCase) Reject(ctx context.Context, id, companionID string) (*entity.ServiceRequest, error) {
	req, err := uc.repo.GetByID(ctx, id)
	if err != nil {
		return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "failed to get request")
	}
	if req == nil {
		return nil, apperr.ErrNotFound
	}
	if req.Status != "pending" {
		return nil, apperr.New(apperr.ErrCodeBadRequest, "request is not pending")
	}

	if err := uc.repo.UpdateStatus(ctx, id, "rejected", companionID); err != nil {
		return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "failed to update request")
	}

	req.Status = "rejected"
	req.CompanionID = companionID

	if uc.Hub != nil {
		uc.Hub.SendToUser(req.ClientID, ws.Message{
			Type: "request_rejected",
			Data: req,
		})
	}

	return req, nil
}