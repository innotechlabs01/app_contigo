package repository

import (
	"context"
	"time"

	"github.com/contigo/backend/internal/requests/domain/entity"
)

type RequestRepository interface {
	Create(ctx context.Context, req *entity.ServiceRequest) error
	GetByID(ctx context.Context, id string) (*entity.ServiceRequest, error)
	ListByClient(ctx context.Context, clientID string) ([]*entity.ServiceRequest, error)
	ListByCompanion(ctx context.Context, companionID string) ([]*entity.ServiceRequest, error)
	ListExpiredPending(ctx context.Context, now time.Time) ([]*entity.ServiceRequest, error)
	UpdateStatus(ctx context.Context, id, status, companionID string) error
}
