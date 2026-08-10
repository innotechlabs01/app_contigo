package usecase

import (
	"context"
	"time"

	"github.com/contigo/backend/internal/requests/domain/entity"
	"github.com/contigo/backend/internal/requests/domain/repository"
	"github.com/contigo/backend/internal/requests/ws"
	apperr "github.com/contigo/backend/pkg/errors"
	"github.com/contigo/backend/pkg/validator"
	"github.com/google/uuid"
)

// CompanionDirectory lets the request flow validate the target companion.
type CompanionDirectory interface {
	IsCompanion(ctx context.Context, userID string) (bool, error)
}

type RequestUseCase struct {
	repo        repository.RequestRepository
	Hub         *ws.Hub
	companions  CompanionDirectory
	expiry      time.Duration
	sweeperStop chan struct{}
}

func NewRequestUseCase(repo repository.RequestRepository, hub *ws.Hub, companions CompanionDirectory, expiry time.Duration) *RequestUseCase {
	if hub == nil {
		hub = ws.NewHub()
	}
	if expiry <= 0 {
		expiry = 15 * time.Minute
	}
	return &RequestUseCase{
		repo:        repo,
		Hub:         hub,
		companions:  companions,
		expiry:      expiry,
		sweeperStop: make(chan struct{}),
	}
}

// StartExpirySweeper runs the DB-driven sweeper that marks pending requests
// whose expires_at has passed as expired. State lives in the database, so it
// survives restarts and does not race with Accept/Reject.
func (uc *RequestUseCase) StartExpirySweeper(ctx context.Context, interval time.Duration) {
	if interval <= 0 {
		interval = time.Minute
	}
	go func() {
		ticker := time.NewTicker(interval)
		defer ticker.Stop()
		for {
			select {
			case <-ctx.Done():
				return
			case <-uc.sweeperStop:
				return
			case <-ticker.C:
				uc.expirePending(ctx)
			}
		}
	}()
}

func (uc *RequestUseCase) StopExpirySweeper() {
	close(uc.sweeperStop)
}

func (uc *RequestUseCase) expirePending(ctx context.Context) {
	now := time.Now()
	expired, err := uc.repo.ListExpiredPending(ctx, now)
	if err != nil {
		return
	}
	for _, req := range expired {
		if err := uc.repo.UpdateStatus(ctx, req.ID, "expired", req.CompanionID); err != nil {
			continue
		}
		req.Status = "expired"
		uc.Hub.SendToUser(req.ClientID, ws.Message{Type: "request_expired", Data: req})
		if req.CompanionID != "" {
			uc.Hub.SendToUser(req.CompanionID, ws.Message{Type: "request_expired", Data: req})
		}
	}
}

type CreateRequestInput struct {
	ServiceType   string  `json:"service_type" validate:"required"`
	CompanionID   string  `json:"companion_id" validate:"required"`
	FullName      string  `json:"full_name" validate:"required"`
	Phone         string  `json:"phone" validate:"required"`
	Address       string  `json:"address" validate:"required"`
	MeetingPoint  *string `json:"meeting_point,omitempty"`
	PreferredDate string  `json:"preferred_date" validate:"required"`
	Notes         *string `json:"notes,omitempty"`
}

func (uc *RequestUseCase) Create(ctx context.Context, clientID string, input *CreateRequestInput) (*entity.ServiceRequest, error) {
	if err := validator.Validate(input); err != nil {
		return nil, err
	}

	if uc.companions != nil {
		ok, err := uc.companions.IsCompanion(ctx, input.CompanionID)
		if err != nil {
			return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "failed to validate companion")
		}
		if !ok {
			// Generic message: do not reveal whether a companion exists.
			return nil, apperr.New(apperr.ErrCodeBadRequest, "invalid request")
		}
	}

	now := time.Now()
	expiresAt := now.Add(uc.expiry)
	req := &entity.ServiceRequest{
		ID:            uuid.New().String(),
		ClientID:      clientID,
		CompanionID:   input.CompanionID,
		ServiceType:   input.ServiceType,
		FullName:      input.FullName,
		Phone:         input.Phone,
		Address:       input.Address,
		MeetingPoint:  input.MeetingPoint,
		PreferredDate: input.PreferredDate,
		Notes:         input.Notes,
		Status:        "pending",
		ExpiresAt:     &expiresAt,
		CreatedAt:     now,
		UpdatedAt:     now,
	}

	if err := uc.repo.Create(ctx, req); err != nil {
		return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "failed to create request")
	}

	if uc.Hub != nil {
		uc.Hub.SendToUser(req.CompanionID, ws.Message{
			Type: "request_created",
			Data: req,
		})
	}

	return req, nil
}

// GetByID returns a request only to its owner (the client who created it or
// the companion it is addressed to). Other users get a 404 to avoid leaking
// PII (full_name, phone, address, meeting_point, preferred_date, notes).
func (uc *RequestUseCase) GetByID(ctx context.Context, id, userID string) (*entity.ServiceRequest, error) {
	req, err := uc.repo.GetByID(ctx, id)
	if err != nil {
		return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "failed to get request")
	}
	if req == nil {
		return nil, apperr.ErrNotFound
	}
	if req.ClientID != userID && req.CompanionID != userID {
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

// IsCompanionUser reports whether the user has the companion role. It is used
// by the List handler to resolve which list to return from the server-side
// role instead of trusting a client-supplied role parameter.
func (uc *RequestUseCase) IsCompanionUser(ctx context.Context, userID string) (bool, error) {
	if uc.companions == nil {
		return false, nil
	}
	return uc.companions.IsCompanion(ctx, userID)
}

func (uc *RequestUseCase) Accept(ctx context.Context, id, companionID string) (*entity.ServiceRequest, error) {
	req, err := uc.repo.GetByID(ctx, id)
	if err != nil {
		return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "failed to get request")
	}
	if req == nil {
		return nil, apperr.ErrNotFound
	}
	if req.CompanionID != companionID {
		return nil, apperr.New(apperr.ErrCodeForbidden, "request is not addressed to this companion")
	}
	if req.Status != "pending" {
		return nil, apperr.New(apperr.ErrCodeBadRequest, "request is not pending")
	}

	if err := uc.repo.UpdateStatus(ctx, id, "accepted", companionID); err != nil {
		return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "failed to update request")
	}

	req.Status = "accepted"

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
	if req.CompanionID != companionID {
		return nil, apperr.New(apperr.ErrCodeForbidden, "request is not addressed to this companion")
	}
	if req.Status != "pending" {
		return nil, apperr.New(apperr.ErrCodeBadRequest, "request is not pending")
	}

	if err := uc.repo.UpdateStatus(ctx, id, "rejected", companionID); err != nil {
		return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "failed to update request")
	}

	req.Status = "rejected"

	if uc.Hub != nil {
		uc.Hub.SendToUser(req.ClientID, ws.Message{
			Type: "request_rejected",
			Data: req,
		})
	}

	return req, nil
}

func (uc *RequestUseCase) Cancel(ctx context.Context, id, userID string) (*entity.ServiceRequest, error) {
	req, err := uc.repo.GetByID(ctx, id)
	if err != nil {
		return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "failed to get request")
	}
	if req == nil {
		return nil, apperr.ErrNotFound
	}
	if req.ClientID != userID && req.CompanionID != userID {
		return nil, apperr.New(apperr.ErrCodeForbidden, "only the client or the assigned companion can cancel")
	}
	if req.Status != "pending" && req.Status != "accepted" {
		return nil, apperr.New(apperr.ErrCodeBadRequest, "request cannot be cancelled in its current state")
	}

	if err := uc.repo.UpdateStatus(ctx, id, "cancelled", req.CompanionID); err != nil {
		return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "failed to update request")
	}

	req.Status = "cancelled"

	if uc.Hub != nil {
		if req.ClientID == userID {
			uc.Hub.SendToUser(req.CompanionID, ws.Message{Type: "request_cancelled", Data: req})
		} else {
			uc.Hub.SendToUser(req.ClientID, ws.Message{Type: "request_cancelled", Data: req})
		}
	}

	return req, nil
}
