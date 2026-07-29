package repository

import (
	"context"

	"github.com/contigo/backend/internal/roles/domain/entity"
)

// RoleRepository defines the interface for role data access.
type RoleRepository interface {
	FindByID(ctx context.Context, id string) (*entity.Role, error)
	FindByName(ctx context.Context, name string) (*entity.Role, error)
	Create(ctx context.Context, role *entity.Role) error
	Update(ctx context.Context, role *entity.Role) error
	Delete(ctx context.Context, id string) error
	List(ctx context.Context) ([]*entity.Role, error)
}
