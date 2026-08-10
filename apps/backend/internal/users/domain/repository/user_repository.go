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

	// Upsert creates the user when it does not exist or updates it when it does.
	Upsert(ctx context.Context, user *entity.User) error

	// AssignRole grants the role with the given name (client/companion) to the user.
	AssignRole(ctx context.Context, userID, roleName string) error

	// HasRole reports whether the user holds the role with the given name.
	HasRole(ctx context.Context, userID, roleName string) (bool, error)

	// GetRole returns the primary role of the user (companion has
	// precedence over client).
	GetRole(ctx context.Context, userID string) (string, error)

	// UpsertCompanionProfile creates or updates the public companion profile.
	UpsertCompanionProfile(ctx context.Context, profile *entity.CompanionProfile) error

	// ListCompanions returns the active companions with their public profile.
	ListCompanions(ctx context.Context) ([]*entity.Companion, error)
}
