package repository

import (
	"context"

	"github.com/contigo/backend/internal/audit/domain/entity"
)

// AuditRepository defines the interface for audit log data access.
type AuditRepository interface {
	FindByID(ctx context.Context, id string) (*entity.AuditLog, error)
	Create(ctx context.Context, log *entity.AuditLog) error
	List(ctx context.Context, filters AuditFilters) ([]*entity.AuditLog, error)
}

// AuditFilters holds filters for listing audit logs.
type AuditFilters struct {
	UserID     string
	Resource   string
	Action     string
	StartDate  *time.Time
	EndDate    *time.Time
	Offset     int
	Limit      int
}
