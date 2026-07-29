package repository

import (
	"context"

	"github.com/contigo/backend/internal/organizations/domain/entity"
)

// OrganizationRepository defines the interface for organization data access.
type OrganizationRepository interface {
	FindByID(ctx context.Context, id string) (*entity.Organization, error)
	FindBySlug(ctx context.Context, slug string) (*entity.Organization, error)
	Create(ctx context.Context, org *entity.Organization) error
	Update(ctx context.Context, org *entity.Organization) error
	Delete(ctx context.Context, id string) error
	List(ctx context.Context, offset, limit int) ([]*entity.Organization, error)
}
