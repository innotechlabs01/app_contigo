package entity

import "time"

// Notification represents a notification entity.
type Notification struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	Type      string    `json:"type"`
	Title     string    `json:"title"`
	Message   string    `json:"message"`
	Read      bool      `json:"read"`
	Data      map[string]interface{} `json:"data,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}
