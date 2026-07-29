package repository

import (
	"context"

	"github.com/contigo/backend/internal/permissions/domain/entity"
)

// PermissionRepository defines the interface for permission data access.
type PermissionRepository interface {
	FindByID(ctx context.Context, id string) (*entity.Permission, error)
	FindByName(ctx context.Context, name string) (*entity.Permission, error)
	Create(ctx context.Context, perm *entity.Permission) error
	Delete(ctx context.Context, id string) error
	List(ctx context.Context) ([]*entity.Permission, error)
}
