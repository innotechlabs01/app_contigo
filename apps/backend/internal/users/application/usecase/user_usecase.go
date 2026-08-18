package usecase

import (
	"context"
	"database/sql"
	"errors"
	"strings"
	"time"

	"github.com/contigo/backend/internal/users/domain/entity"
	"github.com/contigo/backend/internal/users/domain/repository"
	apperr "github.com/contigo/backend/pkg/errors"
	"github.com/contigo/backend/pkg/validator"
)

type UserUseCase struct {
	repo repository.UserRepository
}

func NewUserUseCase(repo repository.UserRepository) *UserUseCase {
	return &UserUseCase{repo: repo}
}

type UpsertMeInput struct {
	Email     string `json:"email" validate:"required,email"`
	FirstName string `json:"first_name" validate:"required"`
	LastName  string `json:"last_name" validate:"required"`
	Phone     string `json:"phone,omitempty"`
	Avatar    string `json:"avatar,omitempty"`
	Role      string `json:"role,omitempty" validate:"omitempty,oneof=client companion"`
}

// UpsertMe creates the user associated with a Clerk identity or updates it.
// The user ID is the Clerk subject (sub), which is set by the auth middleware.
// The role is stored in the user_roles table, never read from Clerk metadata.
// The role sent by the client is only honored when the user is created for
// the first time; existing users can never change their role through this
// endpoint (prevents privilege escalation).
func (uc *UserUseCase) UpsertMe(ctx context.Context, clerkID string, input *UpsertMeInput) (*entity.User, error) {
	if err := validator.Validate(input); err != nil {
		return nil, err
	}

	_, err := uc.repo.FindByClerkID(ctx, clerkID)
	isNew := errors.Is(err, sql.ErrNoRows)
	if err != nil && !isNew {
		return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "failed to load user")
	}

	now := time.Now()
	user := &entity.User{
		ID:        clerkID,
		ClerkID:   clerkID,
		Email:     input.Email,
		FirstName: input.FirstName,
		LastName:  input.LastName,
		Phone:     input.Phone,
		Avatar:    input.Avatar,
		Status:    "active",
		CreatedAt: now,
		UpdatedAt: now,
	}

	if err := uc.repo.Upsert(ctx, user); err != nil {
		return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "failed to upsert user")
	}

	// The role is only assigned from the request during registration (first
	// creation). On sign-in the existing role is preserved and a default is
	// only applied when the user has no role yet.
	if isNew {
		role := input.Role
		if role == "" {
			role = resolveRoleByEmail(input.Email)
		}
		if err := uc.repo.AssignRole(ctx, user.ID, role); err != nil {
			return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "failed to assign role")
		}
		if role == "companion" {
			_ = uc.repo.UpsertCompanionProfile(ctx, &entity.CompanionProfile{
				CompanionID:     user.ID,
				Rating:          5.0,
				ExperienceYears: 0,
				Languages:       []string{"es"},
				Services:        []string{},
			})
		}
	}

	user, err = uc.repo.FindByClerkID(ctx, user.ClerkID)
	if err != nil {
		return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "failed to load user")
	}

	assignedRole, err := uc.repo.GetRole(ctx, user.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			if err := uc.repo.AssignRole(ctx, user.ID, "client"); err != nil {
				return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "failed to assign default role")
			}
			assignedRole = "client"
		} else {
			return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "failed to load user role")
		}
	}
	user.Role = assignedRole

	return user, nil
}

func (uc *UserUseCase) ListCompanions(ctx context.Context) ([]*entity.Companion, error) {
	return uc.repo.ListCompanions(ctx)
}

func (uc *UserUseCase) HasRole(ctx context.Context, userID, role string) (bool, error) {
	return uc.repo.HasRole(ctx, userID, strings.ToLower(role))
}

// IsCompanion implements the requests CompanionDirectory port.
func (uc *UserUseCase) IsCompanion(ctx context.Context, userID string) (bool, error) {
	return uc.repo.HasRole(ctx, userID, "companion")
}

// resolveRoleByEmail returns the role for known QA/test companion emails.
// In production this would be replaced by an invite/approval flow.
func resolveRoleByEmail(email string) string {
	companionEmails := map[string]bool{
		"qa-companion@contigo.test.com": true,
	}
	if companionEmails[strings.ToLower(email)] {
		return "companion"
	}
	return "client"
}
