package repository

import (
	"context"

	"github.com/contigo/backend/internal/settings/domain/entity"
)

// SettingRepository defines the interface for settings data access.
type SettingRepository interface {
	FindByKey(ctx context.Context, key string) (*entity.Setting, error)
	FindByCategory(ctx context.Context, category string) ([]*entity.Setting, error)
	Upsert(ctx context.Context, setting *entity.Setting) error
	Delete(ctx context.Context, key string) error
	List(ctx context.Context) ([]*entity.Setting, error)
}
