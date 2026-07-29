package repository

import (
	"context"

	"github.com/contigo/backend/internal/users/domain/entity"
)

type UserRepository interface {
	FindByID(ctx context.Context, id string) (*entity.User, error)
	FindByClerkID(ctx context.Context, clerkID string) (*entity.User, error)
	FindByEmail(ctx context.Context, email string) (*entity.User, error)
	Create(ctx context.Context, user *entity.User) error
	Update(ctx context.Context, user *entity.User) error
	Delete(ctx context.Context, id string) error
	List(ctx context.Context, offset, limit int) ([]*entity.User, int, error)
	Count(ctx context.Context) (int, error)
}
