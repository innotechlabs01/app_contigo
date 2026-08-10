package entity

import "time"

type ServiceRequest struct {
	ID            string     `json:"id"`
	ClientID      string     `json:"client_id"`
	CompanionID   string     `json:"companion_id"`
	ServiceType   string     `json:"service_type"`
	FullName      string     `json:"full_name"`
	Phone         string     `json:"phone"`
	Address       string     `json:"address"`
	MeetingPoint  *string    `json:"meeting_point,omitempty"`
	PreferredDate string     `json:"preferred_date"`
	Notes         *string    `json:"notes,omitempty"`
	Status        string     `json:"status"`
	ExpiresAt     *time.Time `json:"expires_at,omitempty"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
}
