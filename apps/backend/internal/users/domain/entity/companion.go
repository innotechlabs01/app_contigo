package entity

// CompanionProfile holds the public companion profile shown to clients.
type CompanionProfile struct {
	CompanionID     string   `json:"companion_id"`
	Rating          float64  `json:"rating"`
	ExperienceYears int      `json:"experience_years"`
	Languages       []string `json:"languages"`
	Services        []string `json:"services"`
	Bio             string   `json:"bio,omitempty"`
}

// Companion is the read model returned by GET /companions:
// a user with role "companion" joined with its public profile.
type Companion struct {
	ID              string   `json:"id"`
	Email           string   `json:"email"`
	FirstName       string   `json:"first_name"`
	LastName        string   `json:"last_name"`
	Phone           string   `json:"phone,omitempty"`
	Avatar          string   `json:"avatar,omitempty"`
	Rating          float64  `json:"rating"`
	ExperienceYears int      `json:"experience_years"`
	Languages       []string `json:"languages"`
	Services        []string `json:"services"`
	Bio             string   `json:"bio,omitempty"`
}

func (c *Companion) FullName() string {
	return c.FirstName + " " + c.LastName
}
