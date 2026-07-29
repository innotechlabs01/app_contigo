package repository

import (
	"context"

	"github.com/contigo/backend/internal/files/domain/entity"
)

// FileRepository defines the interface for file data access.
type FileRepository interface {
	FindByID(ctx context.Context, id string) (*entity.File, error)
	Create(ctx context.Context, file *entity.File) error
	Delete(ctx context.Context, id string) error
	List(ctx context.Context, uploadedBy string, offset, limit int) ([]*entity.File, error)
}
