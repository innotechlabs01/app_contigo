package repository

import (
	"context"

	"github.com/contigo/backend/internal/notifications/domain/entity"
)

// NotificationRepository defines the interface for notification data access.
type NotificationRepository interface {
	FindByID(ctx context.Context, id string) (*entity.Notification, error)
	Create(ctx context.Context, notif *entity.Notification) error
	MarkAsRead(ctx context.Context, id string) error
	ListByUser(ctx context.Context, userID string, offset, limit int) ([]*entity.Notification, error)
	CountUnread(ctx context.Context, userID string) (int, error)
}
