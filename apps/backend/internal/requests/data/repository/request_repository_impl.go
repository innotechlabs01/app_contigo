package repository

import (
	"context"
	"database/sql"
	"time"

	"github.com/contigo/backend/internal/requests/domain/entity"
	domainrepo "github.com/contigo/backend/internal/requests/domain/repository"
	"github.com/contigo/backend/infrastructure/database/turso"
)

type requestRepositoryImpl struct {
	pool turso.Pool
}

func NewRequestRepository(pool turso.Pool) domainrepo.RequestRepository {
	return &requestRepositoryImpl{pool: pool}
}

func scanRequest(row interface{ Scan(dest ...any) error }) (*entity.ServiceRequest, error) {
	var (
		id, clientID, companionID, serviceType, fullName, phone, address, preferredDate, status string
		meetingPoint, notes                                                                      sql.NullString
		createdAt, updatedAt                                                                     time.Time
	)
	err := row.Scan(&id, &clientID, &companionID, &serviceType, &fullName, &phone, &address,
		&meetingPoint, &preferredDate, &notes, &status, &createdAt, &updatedAt)
	if err != nil {
		return nil, err
	}
	r := &entity.ServiceRequest{
		ID: id, ClientID: clientID, CompanionID: companionID,
		ServiceType: serviceType, FullName: fullName, Phone: phone,
		Address: address, PreferredDate: preferredDate, Status: status,
		CreatedAt: createdAt, UpdatedAt: updatedAt,
	}
	if meetingPoint.Valid { r.MeetingPoint = &meetingPoint.String }
	if notes.Valid { r.Notes = &notes.String }
	return r, nil
}

func scanRequests(rows *sql.Rows) ([]*entity.ServiceRequest, error) {
	var result []*entity.ServiceRequest
	for rows.Next() {
		r, err := scanRequest(rows)
		if err != nil { return nil, err }
		result = append(result, r)
	}
	return result, rows.Err()
}

func (r *requestRepositoryImpl) Create(ctx context.Context, req *entity.ServiceRequest) error {
	conn, err := r.pool.Conn(ctx)
	if err != nil { return err }
	defer conn.Close()

	_, err = conn.ExecContext(ctx,
		`INSERT INTO service_requests (id, client_id, companion_id, service_type, full_name, 
		 phone, address, meeting_point, preferred_date, notes, status, created_at, updated_at)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		req.ID, req.ClientID, req.CompanionID, req.ServiceType, req.FullName,
		req.Phone, req.Address, req.MeetingPoint, req.PreferredDate, req.Notes,
		req.Status, req.CreatedAt, req.UpdatedAt)
	return err
}

func (r *requestRepositoryImpl) GetByID(ctx context.Context, id string) (*entity.ServiceRequest, error) {
	conn, err := r.pool.Conn(ctx)
	if err != nil { return nil, err }
	defer conn.Close()

	row := conn.QueryRowContext(ctx,
		`SELECT id, client_id, companion_id, service_type, full_name, phone, address,
		 meeting_point, preferred_date, notes, status, created_at, updated_at
		 FROM service_requests WHERE id = ?`, id)
	return scanRequest(row)
}

func (r *requestRepositoryImpl) ListByClient(ctx context.Context, clientID string) ([]*entity.ServiceRequest, error) {
	conn, err := r.pool.Conn(ctx)
	if err != nil { return nil, err }
	defer conn.Close()

	rows, err := conn.QueryContext(ctx,
		`SELECT id, client_id, companion_id, service_type, full_name, phone, address,
		 meeting_point, preferred_date, notes, status, created_at, updated_at
		 FROM service_requests WHERE client_id = ? ORDER BY created_at DESC`, clientID)
	if err != nil { return nil, err }
	defer rows.Close()
	return scanRequests(rows)
}

func (r *requestRepositoryImpl) ListByCompanion(ctx context.Context, companionID string) ([]*entity.ServiceRequest, error) {
	conn, err := r.pool.Conn(ctx)
	if err != nil { return nil, err }
	defer conn.Close()

	rows, err := conn.QueryContext(ctx,
		`SELECT id, client_id, companion_id, service_type, full_name, phone, address,
		 meeting_point, preferred_date, notes, status, created_at, updated_at
		 FROM service_requests WHERE companion_id = ? ORDER BY created_at DESC`, companionID)
	if err != nil { return nil, err }
	defer rows.Close()
	return scanRequests(rows)
}

func (r *requestRepositoryImpl) ListPending(ctx context.Context) ([]*entity.ServiceRequest, error) {
	conn, err := r.pool.Conn(ctx)
	if err != nil { return nil, err }
	defer conn.Close()

	rows, err := conn.QueryContext(ctx,
		`SELECT id, client_id, companion_id, service_type, full_name, phone, address,
		 meeting_point, preferred_date, notes, status, created_at, updated_at
		 FROM service_requests WHERE status = 'pending' ORDER BY created_at DESC`)
	if err != nil { return nil, err }
	defer rows.Close()
	return scanRequests(rows)
}

func (r *requestRepositoryImpl) UpdateStatus(ctx context.Context, id, status, companionID string) error {
	conn, err := r.pool.Conn(ctx)
	if err != nil { return err }
	defer conn.Close()

	_, err = conn.ExecContext(ctx,
		`UPDATE service_requests SET status = ?, companion_id = ?, updated_at = datetime('now') WHERE id = ?`,
		status, companionID, id)
	return err
}
