package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"time"

	"github.com/contigo/backend/infrastructure/database/turso"
	"github.com/contigo/backend/internal/users/domain/entity"
	domainrepo "github.com/contigo/backend/internal/users/domain/repository"
)

type userRepositoryImpl struct {
	pool turso.Pool
}

func NewUserRepository(pool turso.Pool) domainrepo.UserRepository {
	return &userRepositoryImpl{pool: pool}
}

func (r *userRepositoryImpl) FindByID(ctx context.Context, id string) (*entity.User, error) {
	conn, err := r.pool.Conn(ctx)
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	row := conn.QueryRowContext(ctx,
		`SELECT id, clerk_id, email, first_name, last_name, phone, avatar, status, created_at, updated_at
		 FROM users WHERE id = ?`, id)
	return scanUser(row)
}

func (r *userRepositoryImpl) FindByClerkID(ctx context.Context, clerkID string) (*entity.User, error) {
	conn, err := r.pool.Conn(ctx)
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	row := conn.QueryRowContext(ctx,
		`SELECT id, clerk_id, email, first_name, last_name, phone, avatar, status, created_at, updated_at
		 FROM users WHERE clerk_id = ?`, clerkID)
	return scanUser(row)
}

func (r *userRepositoryImpl) FindByEmail(ctx context.Context, email string) (*entity.User, error) {
	conn, err := r.pool.Conn(ctx)
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	row := conn.QueryRowContext(ctx,
		`SELECT id, clerk_id, email, first_name, last_name, phone, avatar, status, created_at, updated_at
		 FROM users WHERE email = ?`, email)
	return scanUser(row)
}

func (r *userRepositoryImpl) Create(ctx context.Context, user *entity.User) error {
	conn, err := r.pool.Conn(ctx)
	if err != nil {
		return err
	}
	defer conn.Close()

	_, err = conn.ExecContext(ctx,
		`INSERT INTO users (id, clerk_id, email, first_name, last_name, phone, avatar, status, created_at, updated_at)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		user.ID, user.ClerkID, user.Email, user.FirstName, user.LastName,
		user.Phone, user.Avatar, user.Status, user.CreatedAt, user.UpdatedAt)
	return err
}

func (r *userRepositoryImpl) Update(ctx context.Context, user *entity.User) error {
	conn, err := r.pool.Conn(ctx)
	if err != nil {
		return err
	}
	defer conn.Close()

	_, err = conn.ExecContext(ctx,
		`UPDATE users SET email = ?, first_name = ?, last_name = ?, phone = ?, avatar = ?,
		 status = ?, updated_at = datetime('now') WHERE id = ?`,
		user.Email, user.FirstName, user.LastName, user.Phone, user.Avatar, user.Status, user.ID)
	return err
}

func (r *userRepositoryImpl) Delete(ctx context.Context, id string) error {
	conn, err := r.pool.Conn(ctx)
	if err != nil {
		return err
	}
	defer conn.Close()

	_, err = conn.ExecContext(ctx, `DELETE FROM users WHERE id = ?`, id)
	return err
}

func (r *userRepositoryImpl) List(ctx context.Context, offset, limit int) ([]*entity.User, int, error) {
	conn, err := r.pool.Conn(ctx)
	if err != nil {
		return nil, 0, err
	}
	defer conn.Close()

	var total int
	if err := conn.QueryRowContext(ctx, `SELECT COUNT(*) FROM users`).Scan(&total); err != nil {
		return nil, 0, err
	}

	rows, err := conn.QueryContext(ctx,
		`SELECT id, clerk_id, email, first_name, last_name, phone, avatar, status, created_at, updated_at
		 FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?`, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var result []*entity.User
	for rows.Next() {
		u, err := scanUser(rows)
		if err != nil {
			return nil, 0, err
		}
		result = append(result, u)
	}
	return result, total, rows.Err()
}

func (r *userRepositoryImpl) Count(ctx context.Context) (int, error) {
	conn, err := r.pool.Conn(ctx)
	if err != nil {
		return 0, err
	}
	defer conn.Close()

	var total int
	if err := conn.QueryRowContext(ctx, `SELECT COUNT(*) FROM users`).Scan(&total); err != nil {
		return 0, err
	}
	return total, nil
}

func (r *userRepositoryImpl) Upsert(ctx context.Context, user *entity.User) error {
	conn, err := r.pool.Conn(ctx)
	if err != nil {
		return err
	}
	defer conn.Close()

	_, err = conn.ExecContext(ctx,
		`INSERT INTO users (id, clerk_id, email, first_name, last_name, phone, avatar, status, created_at, updated_at)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		 ON CONFLICT(clerk_id) DO UPDATE SET
		   id = excluded.id,
		   email = excluded.email,
		   first_name = excluded.first_name,
		   last_name = excluded.last_name,
		   phone = COALESCE(excluded.phone, users.phone),
		   avatar = COALESCE(excluded.avatar, users.avatar),
		   status = excluded.status,
		   updated_at = datetime('now')`,
		user.ID, user.ClerkID, user.Email, user.FirstName, user.LastName,
		user.Phone, user.Avatar, user.Status, user.CreatedAt, user.UpdatedAt)
	return err
}

func (r *userRepositoryImpl) AssignRole(ctx context.Context, userID, roleName string) error {
	conn, err := r.pool.Conn(ctx)
	if err != nil {
		return err
	}
	defer conn.Close()

	_, err = conn.ExecContext(ctx,
		`INSERT OR IGNORE INTO user_roles (user_id, role_id)
		 SELECT ?, id FROM roles WHERE name = ?`, userID, roleName)
	return err
}

func (r *userRepositoryImpl) HasRole(ctx context.Context, userID, roleName string) (bool, error) {
	conn, err := r.pool.Conn(ctx)
	if err != nil {
		return false, err
	}
	defer conn.Close()

	var count int
	if err := conn.QueryRowContext(ctx,
		`SELECT COUNT(*) FROM user_roles ur
		 JOIN roles r ON r.id = ur.role_id
		 WHERE ur.user_id = ? AND r.name = ?`, userID, roleName).Scan(&count); err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *userRepositoryImpl) GetRole(ctx context.Context, userID string) (string, error) {
	conn, err := r.pool.Conn(ctx)
	if err != nil {
		return "", err
	}
	defer conn.Close()

	var role string
	if err := conn.QueryRowContext(ctx,
		`SELECT r.name FROM user_roles ur
		 JOIN roles r ON r.id = ur.role_id
		 WHERE ur.user_id = ?
		 ORDER BY CASE r.name WHEN 'companion' THEN 0 WHEN 'client' THEN 1 ELSE 2 END
		 LIMIT 1`, userID).Scan(&role); err != nil {
		return "", err
	}
	return role, nil
}

func (r *userRepositoryImpl) UpsertCompanionProfile(ctx context.Context, profile *entity.CompanionProfile) error {
	conn, err := r.pool.Conn(ctx)
	if err != nil {
		return err
	}
	defer conn.Close()

	languages, err := json.Marshal(profile.Languages)
	if err != nil {
		return err
	}
	services, err := json.Marshal(profile.Services)
	if err != nil {
		return err
	}

	_, err = conn.ExecContext(ctx,
		`INSERT INTO companion_profiles (companion_id, rating, experience_years, languages, services, bio, created_at, updated_at)
		 VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
		 ON CONFLICT(companion_id) DO UPDATE SET
		   rating = excluded.rating,
		   experience_years = excluded.experience_years,
		   languages = excluded.languages,
		   services = excluded.services,
		   bio = COALESCE(excluded.bio, companion_profiles.bio),
		   updated_at = datetime('now')`,
		profile.CompanionID, profile.Rating, profile.ExperienceYears,
		string(languages), string(services), profile.Bio)
	return err
}

func (r *userRepositoryImpl) ListCompanions(ctx context.Context) ([]*entity.Companion, error) {
	conn, err := r.pool.Conn(ctx)
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	rows, err := conn.QueryContext(ctx,
		`SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.avatar,
		        COALESCE(cp.rating, 5.0),
		        COALESCE(cp.experience_years, 0),
		        COALESCE(cp.languages, '[]'),
		        COALESCE(cp.services, '[]'),
		        COALESCE(cp.bio, '')
		 FROM users u
		 JOIN user_roles ur ON ur.user_id = u.id
		 JOIN roles r ON r.id = ur.role_id
		 LEFT JOIN companion_profiles cp ON cp.companion_id = u.id
		 WHERE r.name = 'companion' AND u.status = 'active'
		 ORDER BY cp.rating DESC, u.first_name ASC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []*entity.Companion
	for rows.Next() {
		c, err := scanCompanion(rows)
		if err != nil {
			return nil, err
		}
		result = append(result, c)
	}
	return result, rows.Err()
}

func scanUser(row interface{ Scan(dest ...any) error }) (*entity.User, error) {
	var (
		id, clerkID, email, firstName, lastName, status string
		phone, avatar                                   sql.NullString
		createdAt, updatedAt                            time.Time
	)
	if err := row.Scan(&id, &clerkID, &email, &firstName, &lastName,
		&phone, &avatar, &status, &createdAt, &updatedAt); err != nil {
		return nil, err
	}
	u := &entity.User{
		ID: id, ClerkID: clerkID, Email: email, FirstName: firstName,
		LastName: lastName, Status: status, CreatedAt: createdAt, UpdatedAt: updatedAt,
	}
	if phone.Valid {
		u.Phone = phone.String
	}
	if avatar.Valid {
		u.Avatar = avatar.String
	}
	return u, nil
}

func scanCompanion(row interface{ Scan(dest ...any) error }) (*entity.Companion, error) {
	var (
		id, email, firstName, lastName string
		phone, avatar                  sql.NullString
		rating                         float64
		experienceYears                int
		languagesRaw, servicesRaw, bio sql.NullString
	)
	if err := row.Scan(&id, &email, &firstName, &lastName, &phone, &avatar,
		&rating, &experienceYears, &languagesRaw, &servicesRaw, &bio); err != nil {
		return nil, err
	}

	c := &entity.Companion{
		ID: id, Email: email, FirstName: firstName, LastName: lastName,
		Rating: rating, ExperienceYears: experienceYears,
	}
	if phone.Valid {
		c.Phone = phone.String
	}
	if avatar.Valid {
		c.Avatar = avatar.String
	}
	if languagesRaw.Valid {
		_ = json.Unmarshal([]byte(languagesRaw.String), &c.Languages)

	}
	if servicesRaw.Valid {
		_ = json.Unmarshal([]byte(servicesRaw.String), &c.Services)
	}
	if bio.Valid {
		c.Bio = bio.String
	}
	return c, nil
}
