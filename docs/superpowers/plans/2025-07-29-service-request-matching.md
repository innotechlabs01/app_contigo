# Service Request Matching Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement real-time client→companion service request matching with WebSocket push

**Architecture:** Go backend (Fiber v3) with Turso/SQLite, REST API + WebSocket hub in memory. Flutter mobile with Riverpod WebSocket provider consuming events in real-time.

**Tech Stack:** Go 1.24, Fiber v3, Turso (libsql), WebSocket (gofiber/contrib/websocket), Flutter 3.35+, Riverpod 3.x, go_router

---

## File Structure

### Backend (Go) — new files under `apps/backend/`

```
internal/requests/
├── domain/
│   ├── entity/
│   │   └── service_request.go
│   └── repository/
│       └── request_repository.go
├── interfaces/
│   └── http/
│       ├── handler/
│       │   └── request_handler.go
│       └── route/
│           └── request_route.go
├── application/
│   └── usecase/
│       └── request_usecase.go
├── data/
│   └── repository/
│       └── request_repository_impl.go
└── ws/
    └── hub.go

infrastructure/database/migration/migrations/
├── 000013_create_service_requests.up.sql
└── 000013_create_service_requests.down.sql
```

### Backend — modified files
- `go.mod` (add websocket + uuid deps)
- `cmd/server/main.go` (register routes + WS hub)

### Mobile (Flutter) — new files under `apps/mobile/lib/`

```
features/companion/data/
├── datasources/
│   └── request_api_datasource.dart
└── repositories/
    └── request_repository_impl.dart

features/companion/presentation/
├── view_models/
│   └── companion_requests_view_model.dart
└── widgets/
    └── incoming_request_card.dart

core/ws/
├── ws_provider.dart
└── ws_event.dart
```

### Mobile — modified files
- `features/client/domain/entities/service_request.dart` (add companionId, clientId)
- `features/client/domain/entities/request_status.dart` (align with backend)
- `features/client/domain/repositories/request_repository.dart` (add accept/reject)
- `features/client/data/datasources/request_api_datasource.dart` (real HTTP calls)
- `features/client/data/repositories/request_repository_impl.dart` (forward new methods)
- `features/client/data/mappers/request_mapper.dart` (add fields)
- `features/client/presentation/screens/my_requests_screen.dart` (live data via Riverpod)
- `features/companion/presentation/screens/requests_tab.dart` (live incoming requests)
- `core/di/providers.dart` (add WS provider)
- `core/network/api_endpoints.dart` (add endpoints)
- `pubspec.yaml` (add web_socket_channel dep)

---

### Task 1: Migration — service_requests table

**Files:**
- Create: `apps/backend/infrastructure/database/migration/migrations/000013_create_service_requests.up.sql`
- Create: `apps/backend/infrastructure/database/migration/migrations/000013_create_service_requests.down.sql`

- [ ] **Step 1: Create up migration**

Write `000013_create_service_requests.up.sql`:

```sql
CREATE TABLE service_requests (
    id             TEXT PRIMARY KEY,
    client_id      TEXT NOT NULL REFERENCES users(id),
    companion_id   TEXT NOT NULL REFERENCES users(id),
    service_type   TEXT NOT NULL,
    full_name      TEXT NOT NULL,
    phone          TEXT NOT NULL,
    address        TEXT NOT NULL,
    meeting_point  TEXT,
    preferred_date TEXT NOT NULL,
    notes          TEXT,
    status         TEXT NOT NULL DEFAULT 'pending',
    created_at     TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_sr_client ON service_requests(client_id);
CREATE INDEX idx_sr_companion ON service_requests(companion_id);
CREATE INDEX idx_sr_status ON service_requests(status);
```

- [ ] **Step 2: Create down migration**

Write `000013_create_service_requests.down.sql`:

```sql
DROP INDEX IF EXISTS idx_sr_status;
DROP INDEX IF EXISTS idx_sr_companion;
DROP INDEX IF EXISTS idx_sr_client;
DROP TABLE IF EXISTS service_requests;
```

- [ ] **Step 3: Verify migration pattern matches existing**

Run: `ls apps/backend/infrastructure/database/migration/migrations/ | tail -5`
Expected: shows `000012_...` files

- [ ] **Step 4: Commit**

```bash
git add apps/backend/infrastructure/database/migration/migrations/000013_create_service_requests.*.sql
git commit -m "feat(db): add service_requests table migration"
```

---

### Task 2: Backend — Domain entity + repository interface

**Files:**
- Create: `apps/backend/internal/requests/domain/entity/service_request.go`
- Create: `apps/backend/internal/requests/domain/repository/request_repository.go`

- [ ] **Step 1: Create ServiceRequest entity**

Write `internal/requests/domain/entity/service_request.go`:

```go
package entity

import "time"

type ServiceRequest struct {
	ID            string    `json:"id"`
	ClientID      string    `json:"client_id"`
	CompanionID   string    `json:"companion_id"`
	ServiceType   string    `json:"service_type"`
	FullName      string    `json:"full_name"`
	Phone         string    `json:"phone"`
	Address       string    `json:"address"`
	MeetingPoint  *string   `json:"meeting_point,omitempty"`
	PreferredDate string    `json:"preferred_date"`
	Notes         *string   `json:"notes,omitempty"`
	Status        string    `json:"status"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
```

- [ ] **Step 2: Create repository interface**

Write `internal/requests/domain/repository/request_repository.go`:

```go
package repository

import (
	"context"
	"github.com/contigo/backend/internal/requests/domain/entity"
)

type RequestRepository interface {
	Create(ctx context.Context, req *entity.ServiceRequest) error
	GetByID(ctx context.Context, id string) (*entity.ServiceRequest, error)
	ListByClient(ctx context.Context, clientID string) ([]*entity.ServiceRequest, error)
	ListByCompanion(ctx context.Context, companionID string) ([]*entity.ServiceRequest, error)
	UpdateStatus(ctx context.Context, id, status string) error
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/backend/internal/requests/domain/
git commit -m "feat(backend): add service request entity and repository interface"
```

---

### Task 3: Backend — Repository implementation (Turso/SQLite)

**Files:**
- Create: `apps/backend/internal/requests/data/repository/request_repository_impl.go`

- [ ] **Step 1: Write repository impl**

Write `internal/requests/data/repository/request_repository_impl.go`:

```go
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

func (r *requestRepositoryImpl) UpdateStatus(ctx context.Context, id, status string) error {
	conn, err := r.pool.Conn(ctx)
	if err != nil { return err }
	defer conn.Close()

	_, err = conn.ExecContext(ctx,
		`UPDATE service_requests SET status = ?, updated_at = datetime('now') WHERE id = ?`,
		status, id)
	return err
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/backend/internal/requests/data/
git commit -m "feat(backend): add service request repository implementation"
```

---

### Task 4: Backend — WebSocket Hub

**Files:**
- Create: `apps/backend/internal/requests/ws/hub.go`

- [ ] **Step 1: Write WebSocket hub**

Write `internal/requests/ws/hub.go`:

```go
package ws

import (
	"encoding/json"
	"sync"

	"github.com/gofiber/contrib/websocket"
	"go.uber.org/zap"

	"github.com/contigo/backend/pkg/logger"
)

type Message struct {
	Type   string      `json:"type"`
	Data   interface{} `json:"data,omitempty"`
}

type Hub struct {
	mu    sync.RWMutex
	conns map[string]map[*websocket.Conn]bool // userId -> connections
}

func NewHub() *Hub {
	return &Hub{
		conns: make(map[string]map[*websocket.Conn]bool),
	}
}

func (h *Hub) Register(userID string, conn *websocket.Conn) {
	h.mu.Lock()
	defer h.mu.Unlock()
	if h.conns[userID] == nil {
		h.conns[userID] = make(map[*websocket.Conn]bool)
	}
	h.conns[userID][conn] = true
	logger.Info("WS client registered", zap.String("user_id", userID))
}

func (h *Hub) Unregister(userID string, conn *websocket.Conn) {
	h.mu.Lock()
	defer h.mu.Unlock()
	if h.conns[userID] != nil {
		delete(h.conns[userID], conn)
		if len(h.conns[userID]) == 0 {
			delete(h.conns, userID)
		}
	}
	logger.Info("WS client unregistered", zap.String("user_id", userID))
}

func (h *Hub) SendToUser(userID string, msg Message) {
	h.mu.RLock()
	defer h.mu.RUnlock()
	conns := h.conns[userID]
	if conns == nil { return }
	data, err := json.Marshal(msg)
	if err != nil {
		logger.Error("WS marshal error", zap.Error(err))
		return
	}
	for conn := range conns {
		if err := conn.WriteMessage(websocket.TextMessage, data); err != nil {
			logger.Error("WS write error", zap.Error(err))
			conn.Close()
			go h.Unregister(userID, conn)
		}
	}
}

func (h *Hub) SendToUsers(userIDs []string, msg Message) {
	for _, uid := range userIDs {
		h.SendToUser(uid, msg)
	}
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/backend/internal/requests/ws/hub.go
git commit -m "feat(backend): add WebSocket hub for real-time events"
```

---

### Task 5: Backend — Use case + HTTP handlers + routes

**Files:**
- Create: `apps/backend/internal/requests/application/usecase/request_usecase.go`
- Create: `apps/backend/internal/requests/interfaces/http/handler/request_handler.go`
- Create: `apps/backend/internal/requests/interfaces/http/route/request_route.go`

- [ ] **Step 1: Write use case**

Write `internal/requests/application/usecase/request_usecase.go`:

```go
package usecase

import (
	"context"
	"time"

	"github.com/google/uuid"

	apperr "github.com/contigo/backend/pkg/errors"
	"github.com/contigo/backend/internal/requests/domain/entity"
	"github.com/contigo/backend/internal/requests/domain/repository"
	"github.com/contigo/backend/internal/requests/ws"
)

type RequestUseCase struct {
	repo repository.RequestRepository
	hub  *ws.Hub
}

func NewRequestUseCase(repo repository.RequestRepository, hub *ws.Hub) *RequestUseCase {
	return &RequestUseCase{repo: repo, hub: hub}
}

type CreateRequestInput struct {
	CompanionID   string  `json:"companion_id" validate:"required"`
	ServiceType   string  `json:"service_type" validate:"required"`
	FullName      string  `json:"full_name" validate:"required"`
	Phone         string  `json:"phone" validate:"required"`
	Address       string  `json:"address" validate:"required"`
	MeetingPoint  *string `json:"meeting_point"`
	PreferredDate string  `json:"preferred_date" validate:"required"`
	Notes         *string `json:"notes"`
}

func (uc *RequestUseCase) Create(ctx context.Context, clientID string, input *CreateRequestInput) (*entity.ServiceRequest, error) {
	now := time.Now()
	req := &entity.ServiceRequest{
		ID:            uuid.NewString(),
		ClientID:      clientID,
		CompanionID:   input.CompanionID,
		ServiceType:   input.ServiceType,
		FullName:      input.FullName,
		Phone:         input.Phone,
		Address:       input.Address,
		MeetingPoint:  input.MeetingPoint,
		PreferredDate: input.PreferredDate,
		Notes:         input.Notes,
		Status:        "pending",
		CreatedAt:     now,
		UpdatedAt:     now,
	}

	if err := uc.repo.Create(ctx, req); err != nil {
		return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "Failed to create request")
	}

	uc.hub.SendToUser(input.CompanionID, ws.Message{
		Type: "request_pending",
		Data: req,
	})

	return req, nil
}

func (uc *RequestUseCase) Accept(ctx context.Context, requestID, companionID string) (*entity.ServiceRequest, error) {
	req, err := uc.repo.GetByID(ctx, requestID)
	if err != nil {
		return nil, apperr.Wrap(err, apperr.ErrCodeNotFound, "Request not found")
	}
	if req.CompanionID != companionID {
		return nil, apperr.ErrForbidden
	}
	if req.Status != "pending" {
		return nil, apperr.New(apperr.ErrCodeConflict, "Request is not pending")
	}

	if err := uc.repo.UpdateStatus(ctx, requestID, "accepted"); err != nil {
		return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "Failed to accept request")
	}
	req.Status = "accepted"

	uc.hub.SendToUsers([]string{req.ClientID, req.CompanionID}, ws.Message{
		Type: "request_accepted",
		Data: req,
	})

	return req, nil
}

func (uc *RequestUseCase) Reject(ctx context.Context, requestID, companionID string) (*entity.ServiceRequest, error) {
	req, err := uc.repo.GetByID(ctx, requestID)
	if err != nil {
		return nil, apperr.Wrap(err, apperr.ErrCodeNotFound, "Request not found")
	}
	if req.CompanionID != companionID {
		return nil, apperr.ErrForbidden
	}
	if req.Status != "pending" {
		return nil, apperr.New(apperr.ErrCodeConflict, "Request is not pending")
	}

	if err := uc.repo.UpdateStatus(ctx, requestID, "rejected"); err != nil {
		return nil, apperr.Wrap(err, apperr.ErrCodeInternal, "Failed to reject request")
	}
	req.Status = "rejected"

	uc.hub.SendToUser(req.ClientID, ws.Message{
		Type: "request_rejected",
		Data: req,
	})

	return req, nil
}

func (uc *RequestUseCase) ListByClient(ctx context.Context, clientID string) ([]*entity.ServiceRequest, error) {
	return uc.repo.ListByClient(ctx, clientID)
}

func (uc *RequestUseCase) ListByCompanion(ctx context.Context, companionID string) ([]*entity.ServiceRequest, error) {
	return uc.repo.ListByCompanion(ctx, companionID)
}

func (uc *RequestUseCase) GetByID(ctx context.Context, id string) (*entity.ServiceRequest, error) {
	req, err := uc.repo.GetByID(ctx, id)
	if err != nil {
		return nil, apperr.Wrap(err, apperr.ErrCodeNotFound, "Request not found")
	}
	return req, nil
}
```

- [ ] **Step 2: Write HTTP handler**

Write `internal/requests/interfaces/http/handler/request_handler.go`:

```go
package handler

import (
	"github.com/contigo/backend/internal/requests/application/usecase"
	"github.com/contigo/backend/pkg/response"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v3"
)

type RequestHandler struct {
	uc  *usecase.RequestUseCase
	hub *ws.Hub
}

func NewRequestHandler(uc *usecase.RequestUseCase, hub *ws.Hub) *RequestHandler {
	return &RequestHandler{uc: uc, hub: hub}
}

func (h *RequestHandler) Create(c fiber.Ctx) error {
	clientID := c.Locals("user_id").(string)
	var input usecase.CreateRequestInput
	if err := response.ParseBody(c, &input); err != nil {
		return err
	}
	req, err := h.uc.Create(c.Context(), clientID, &input)
	if err != nil { return err }
	return response.Created(c, req)
}

func (h *RequestHandler) List(c fiber.Ctx) error {
	userID := c.Locals("user_id").(string)
	role := c.Query("role", "client")
	var reqs []*entity.ServiceRequest
	var err error
	if role == "companion" {
		reqs, err = h.uc.ListByCompanion(c.Context(), userID)
	} else {
		reqs, err = h.uc.ListByClient(c.Context(), userID)
	}
	if err != nil { return err }
	return response.Success(c, fiber.StatusOK, reqs)
}

func (h *RequestHandler) GetByID(c fiber.Ctx) error {
	id := c.Params("id")
	req, err := h.uc.GetByID(c.Context(), id)
	if err != nil { return err }
	return response.Success(c, fiber.StatusOK, req)
}

func (h *RequestHandler) Accept(c fiber.Ctx) error {
	id := c.Params("id")
	companionID := c.Locals("user_id").(string)
	req, err := h.uc.Accept(c.Context(), id, companionID)
	if err != nil { return err }
	return response.Success(c, fiber.StatusOK, req)
}

func (h *RequestHandler) Reject(c fiber.Ctx) error {
	id := c.Params("id")
	companionID := c.Locals("user_id").(string)
	req, err := h.uc.Reject(c.Context(), id, companionID)
	if err != nil { return err }
	return response.Success(c, fiber.StatusOK, req)
}

func (h *RequestHandler) HandleWS(c *websocket.Conn) {
	userID := c.Locals("user_id").(string)
	h.hub.Register(userID, c)
	defer h.hub.Unregister(userID, c)

	for {
		_, _, err := c.ReadMessage()
		if err != nil {
			break
		}
	}
}
```

Wait — need to fix handler imports. Let me use correct references:

Write `internal/requests/interfaces/http/handler/request_handler.go`:

```go
package handler

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v3"

	"github.com/contigo/backend/internal/requests/application/usecase"
	"github.com/contigo/backend/internal/requests/ws"
	"github.com/contigo/backend/pkg/response"
)

type RequestHandler struct {
	uc  *usecase.RequestUseCase
}

func NewRequestHandler(uc *usecase.RequestUseCase) *RequestHandler {
	return &RequestHandler{uc: uc}
}

func (h *RequestHandler) Create(c fiber.Ctx) error {
	clientID := c.Locals("user_id").(string)
	var input usecase.CreateRequestInput
	if err := response.ParseBody(c, &input); err != nil {
		return err
	}
	req, err := h.uc.Create(c.Context(), clientID, &input)
	if err != nil { return err }
	return response.Created(c, req)
}

func (h *RequestHandler) List(c fiber.Ctx) error {
	userID := c.Locals("user_id").(string)
	role := c.Query("role", "client")
	var reqs interface{}
	var err error
	if role == "companion" {
		reqs, err = h.uc.ListByCompanion(c.Context(), userID)
	} else {
		reqs, err = h.uc.ListByClient(c.Context(), userID)
	}
	if err != nil { return err }
	return response.Success(c, fiber.StatusOK, reqs)
}

func (h *RequestHandler) GetByID(c fiber.Ctx) error {
	id := c.Params("id")
	req, err := h.uc.GetByID(c.Context(), id)
	if err != nil { return err }
	return response.Success(c, fiber.StatusOK, req)
}

func (h *RequestHandler) Accept(c fiber.Ctx) error {
	id := c.Params("id")
	companionID := c.Locals("user_id").(string)
	req, err := h.uc.Accept(c.Context(), id, companionID)
	if err != nil { return err }
	return response.Success(c, fiber.StatusOK, req)
}

func (h *RequestHandler) Reject(c fiber.Ctx) error {
	id := c.Params("id")
	companionID := c.Locals("user_id").(string)
	req, err := h.uc.Reject(c.Context(), id, companionID)
	if err != nil { return err }
	return response.Success(c, fiber.StatusOK, req)
}

func (h *RequestHandler) HandleWS(c *websocket.Conn) {
	userID := c.Locals("user_id").(string)
	h.uc.Hub.Register(userID, c)
	defer h.uc.Hub.Unregister(userID, c)

	for {
		_, _, err := c.ReadMessage()
		if err != nil {
			break
		}
	}
}
```

- [ ] **Step 3: Write route registration**

Write `internal/requests/interfaces/http/route/request_route.go`:

```go
package route

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v3"

	"github.com/contigo/backend/internal/requests/interfaces/http/handler"
)

func Register(v1 fiber.Router, h *handler.RequestHandler) {
	requests := v1.Group("/requests")
	requests.Post("/", h.Create)
	requests.Get("/", h.List)
	requests.Get("/:id", h.GetByID)
	requests.Post("/:id/accept", h.Accept)
	requests.Post("/:id/reject", h.Reject)

	v1.Get("/ws", websocket.New(h.HandleWS, websocket.Config{
		Filter: func(c fiber.Ctx) bool {
			return true // auth handled by v1 middleware
		},
	}))
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/backend/internal/requests/application/ apps/backend/internal/requests/interfaces/
git commit -m "feat(backend): add service request use case, handlers and routes"
```

---

### Task 6: Backend — Wire up in main.go + go.mod deps

**Files:**
- Modify: `apps/backend/cmd/server/main.go`
- Modify: `apps/backend/go.mod`

- [ ] **Step 1: Add dependencies to go.mod**

Run from `apps/backend/`:

```bash
cd apps/backend
go get github.com/gofiber/contrib/websocket
go get github.com/google/uuid
```

- [ ] **Step 2: Wire up in main.go**

Edit `cmd/server/main.go` — add imports and registration:

After the existing imports, add:

```go
	requestws "github.com/contigo/backend/internal/requests/ws"
	requestrepo "github.com/contigo/backend/internal/requests/data/repository"
	requestusecase "github.com/contigo/backend/internal/requests/application/usecase"
	requesthandler "github.com/contigo/backend/internal/requests/interfaces/http/handler"
	requestroute "github.com/contigo/backend/internal/requests/interfaces/http/route"
```

Before `// Graceful shutdown` comment, add:

```go
	// Initialize request service
	wsHub := requestws.NewHub()
	reqRepo := requestrepo.NewRequestRepository(pool)
	reqUC := requestusecase.NewRequestUseCase(reqRepo, wsHub)
	reqHandler := requesthandler.NewRequestHandler(reqUC)
	requestroute.Register(v1, reqHandler)
```

- [ ] **Step 3: Build to verify**

Run from `apps/backend/`:

```bash
cd apps/backend && go build ./...
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add apps/backend/cmd/server/main.go apps/backend/go.mod apps/backend/go.sum
git commit -m "feat(backend): wire up request service in main.go"
```

---

### Task 7: Mobile — Update domain entities

**Files:**
- Modify: `apps/mobile/lib/features/client/domain/entities/service_request.dart`
- Modify: `apps/mobile/lib/features/client/domain/entities/request_status.dart`

- [ ] **Step 1: Update RequestStatus enum**

Edit `features/client/domain/entities/request_status.dart`:

```dart
enum RequestStatus { pending, accepted, rejected, cancelled, completed }
```

- [ ] **Step 2: Update ServiceRequest entity**

Edit `features/client/domain/entities/service_request.dart` — add `clientId`, `companionId`, remove `idNumber`:

```dart
class ServiceRequest {
  final String id;
  final String clientId;
  final String companionId;
  final String serviceType;
  final String fullName;
  final String phone;
  final String? address;
  final MeetingPoint? meetingPoint;
  final String? preferredDate;
  final String? notes;
  final RequestStatus status;
  final DateTime? createdAt;

  const ServiceRequest({
    required this.id,
    required this.clientId,
    required this.companionId,
    required this.serviceType,
    required this.fullName,
    required this.phone,
    this.address,
    this.meetingPoint,
    this.preferredDate,
    this.notes,
    this.status = RequestStatus.pending,
    this.createdAt,
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/mobile/lib/features/client/domain/entities/
git commit -m "refactor(mobile): update ServiceRequest and RequestStatus for matching flow"
```

---

### Task 8: Mobile — Update repository interface + datasource

**Files:**
- Modify: `apps/mobile/lib/features/client/domain/repositories/request_repository.dart`
- Modify: `apps/mobile/lib/features/client/data/datasources/request_api_datasource.dart`
- Modify: `apps/mobile/lib/features/client/data/repositories/request_repository_impl.dart`
- Modify: `apps/mobile/lib/features/client/data/mappers/request_mapper.dart`

- [ ] **Step 1: Update abstract repository**

Edit `features/client/domain/repositories/request_repository.dart`:

```dart
import '../entities/service_request.dart';

abstract class RequestRepository {
  Future<ServiceRequest> createRequest(ServiceRequest request);
  Future<List<ServiceRequest>> getMyRequests();
  Future<List<ServiceRequest>> getCompanionRequests();
  Future<ServiceRequest> acceptRequest(String requestId);
  Future<ServiceRequest> rejectRequest(String requestId);
}
```

- [ ] **Step 2: Update API datasource with real HTTP calls**

Edit `features/client/data/datasources/request_api_datasource.dart`:

```dart
import 'package:dio/dio.dart';
import '../../../../core/network/api_endpoints.dart';
import '../../domain/entities/service_request.dart';
import '../../domain/entities/request_status.dart';

class RequestApiDatasource {
  final Dio _dio;

  RequestApiDatasource(this._dio);

  Future<ServiceRequest> createRequest(ServiceRequest request) async {
    final response = await _dio.post('${ApiEndpoints.baseUrl}${ApiEndpoints.requests}', data: {
      'companion_id': request.companionId,
      'service_type': request.serviceType,
      'full_name': request.fullName,
      'phone': request.phone,
      'address': request.address,
      'meeting_point': request.meetingPoint?.name,
      'preferred_date': request.preferredDate,
      'notes': request.notes,
    });
    return _fromJson(response.data['data']);
  }

  Future<List<ServiceRequest>> getMyRequests() async {
    final response = await _dio.get('${ApiEndpoints.baseUrl}${ApiEndpoints.requests}');
    return (response.data['data'] as List).map((e) => _fromJson(e)).toList();
  }

  Future<List<ServiceRequest>> getCompanionRequests() async {
    final response = await _dio.get(
      '${ApiEndpoints.baseUrl}${ApiEndpoints.requests}',
      queryParameters: {'role': 'companion'},
    );
    return (response.data['data'] as List).map((e) => _fromJson(e)).toList();
  }

  Future<ServiceRequest> acceptRequest(String requestId) async {
    final response = await _dio.post('${ApiEndpoints.baseUrl}${ApiEndpoints.requests}/$requestId/accept');
    return _fromJson(response.data['data']);
  }

  Future<ServiceRequest> rejectRequest(String requestId) async {
    final response = await _dio.post('${ApiEndpoints.baseUrl}${ApiEndpoints.requests}/$requestId/reject');
    return _fromJson(response.data['data']);
  }

  ServiceRequest _fromJson(Map<String, dynamic> json) {
    return ServiceRequest(
      id: json['id'] as String,
      clientId: json['client_id'] as String,
      companionId: json['companion_id'] as String,
      serviceType: json['service_type'] as String,
      fullName: json['full_name'] as String,
      phone: json['phone'] as String,
      address: json['address'] as String?,
      meetingPoint: json['meeting_point'] != null
          ? MeetingPoint(name: json['meeting_point'] as String)
          : null,
      preferredDate: json['preferred_date'] as String?,
      notes: json['notes'] as String?,
      status: _parseStatus(json['status'] as String),
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : null,
    );
  }

  RequestStatus _parseStatus(String status) {
    switch (status) {
      case 'pending': return RequestStatus.pending;
      case 'accepted': return RequestStatus.accepted;
      case 'rejected': return RequestStatus.rejected;
      case 'cancelled': return RequestStatus.cancelled;
      case 'completed': return RequestStatus.completed;
      default: return RequestStatus.pending;
    }
  }
}
```

- [ ] **Step 3: Update repository impl**

Edit `features/client/data/repositories/request_repository_impl.dart`:

```dart
import '../../domain/entities/service_request.dart';
import '../../domain/repositories/request_repository.dart';
import '../datasources/request_api_datasource.dart';

class RequestRepositoryImpl implements RequestRepository {
  final RequestApiDatasource _datasource;

  RequestRepositoryImpl(this._datasource);

  @override
  Future<ServiceRequest> createRequest(ServiceRequest request) =>
      _datasource.createRequest(request);

  @override
  Future<List<ServiceRequest>> getMyRequests() =>
      _datasource.getMyRequests();

  @override
  Future<List<ServiceRequest>> getCompanionRequests() =>
      _datasource.getCompanionRequests();

  @override
  Future<ServiceRequest> acceptRequest(String requestId) =>
      _datasource.acceptRequest(requestId);

  @override
  Future<ServiceRequest> rejectRequest(String requestId) =>
      _datasource.rejectRequest(requestId);
}
```

- [ ] **Step 4: Update request mapper**

Edit `features/client/data/mappers/request_mapper.dart`:

```dart
import '../../domain/entities/service_request.dart';
import '../../domain/entities/request_status.dart';

class RequestMapper {
  ServiceRequest fromJson(Map<String, dynamic> json) {
    return ServiceRequest(
      id: json['id'] as String,
      clientId: json['client_id'] as String,
      companionId: json['companion_id'] as String,
      serviceType: json['service_type'] as String,
      fullName: json['full_name'] as String,
      phone: json['phone'] as String,
      address: json['address'] as String?,
      meetingPoint: json['meeting_point'] != null
          ? MeetingPoint(name: json['meeting_point'] as String)
          : null,
      preferredDate: json['preferred_date'] as String?,
      notes: json['notes'] as String?,
      status: _parseStatus(json['status'] as String),
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : null,
    );
  }

  RequestStatus _parseStatus(String status) {
    switch (status) {
      case 'pending': return RequestStatus.pending;
      case 'accepted': return RequestStatus.accepted;
      case 'rejected': return RequestStatus.rejected;
      case 'cancelled': return RequestStatus.cancelled;
      case 'completed': return RequestStatus.completed;
      default: return RequestStatus.pending;
    }
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add apps/mobile/lib/features/client/data/ apps/mobile/lib/features/client/domain/repositories/
git commit -m "feat(mobile): connect client datasource to backend API"
```

---

### Task 9: Mobile — WebSocket provider

**Files:**
- Create: `apps/mobile/lib/core/ws/ws_event.dart`
- Create: `apps/mobile/lib/core/ws/ws_provider.dart`
- Modify: `apps/mobile/lib/core/di/providers.dart`
- Modify: `apps/mobile/pubspec.yaml`

- [ ] **Step 1: Add web_socket_channel dependency to pubspec.yaml**

```yaml
  web_socket_channel: ^3.0.1
```

Run: `cd apps/mobile && flutter pub get`

- [ ] **Step 2: Create WS event types**

Write `core/ws/ws_event.dart`:

```dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'ws_event.freezed.dart';
part 'ws_event.g.dart';

@freezed
sealed class WsEvent with _$WsEvent {
  const factory WsEvent.requestPending({
    required Map<String, dynamic> request,
  }) = RequestPending;

  const factory WsEvent.requestAccepted({
    required Map<String, dynamic> request,
  }) = RequestAccepted;

  const factory WsEvent.requestRejected({
    required Map<String, dynamic> request,
  }) = RequestRejected;

  factory WsEvent.fromJson(Map<String, dynamic> json) =>
      _$WsEventFromJson(json);
}
```

Actually, simpler without freezed for this:

Write `core/ws/ws_event.dart`:

```dart
sealed class WsEvent {
  final Map<String, dynamic> request;
  const WsEvent(this.request);
}

class RequestPending extends WsEvent {
  const RequestPending(super.request);
}

class RequestAccepted extends WsEvent {
  const RequestAccepted(super.request);
}

class RequestRejected extends WsEvent {
  const RequestRejected(super.request);
}
```

- [ ] **Step 3: Create WebSocket provider**

Write `core/ws/ws_provider.dart`:

```dart
import 'dart:async';
import 'dart:convert';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import '../../features/auth/presentation/view_models/auth_view_model.dart';
import 'ws_event.dart';

part 'ws_provider.g.dart';

@riverpod
class WebSocketConnection extends _$WebSocketConnection {
  WebSocketChannel? _channel;
  StreamSubscription? _subscription;
  final _eventController = StreamController<WsEvent>.broadcast();
  Timer? _reconnectTimer;

  Stream<WsEvent> get events => _eventController.stream;

  @override
  AsyncValue<void> build() {
    ref.onDispose(() {
      _subscription?.cancel();
      _channel?.sink.close();
      _reconnectTimer?.cancel();
      _eventController.close();
    });

    final authState = ref.watch(authStateProvider);
    if (authState.valueOrNull != null) {
      _connect(authState.requireValue.token);
    }

    return const AsyncValue.data(null);
  }

  void _connect(String token) {
    _channel?.sink.close();
    final uri = Uri.parse('ws://localhost:8080/api/v1/ws?token=$token');
    _channel = WebSocketChannel.connect(uri);
    _subscription = _channel!.stream.listen(
      (data) {
        final json = jsonDecode(data as String) as Map<String, dynamic>;
        final type = json['type'] as String;
        final request = json['data'] as Map<String, dynamic>;
        switch (type) {
          case 'request_pending':
            _eventController.add(RequestPending(request));
          case 'request_accepted':
            _eventController.add(RequestAccepted(request));
          case 'request_rejected':
            _eventController.add(RequestRejected(request));
        }
      },
      onError: (_) => _scheduleReconnect(),
      onDone: () => _scheduleReconnect(),
    );
  }

  void _scheduleReconnect() {
    _reconnectTimer?.cancel();
    _reconnectTimer = Timer(const Duration(seconds: 5), () {
      final authState = ref.read(authStateProvider);
      if (authState.valueOrNull != null) {
        _connect(authState.requireValue.token);
      }
    });
  }
}
```

- [ ] **Step 4: Update providers.dart**

Add to `core/di/providers.dart`:

```dart
import '../ws/ws_provider.dart';
```

- [ ] **Step 5: Commit**

```bash
git add apps/mobile/lib/core/ws/ apps/mobile/pubspec.yaml apps/mobile/pubspec.lock
git commit -m "feat(mobile): add WebSocket provider for real-time events"
```

---

### Task 10: Mobile — Companion incoming requests screen

**Files:**
- Create: `apps/mobile/lib/features/companion/presentation/view_models/companion_requests_view_model.dart`
- Create: `apps/mobile/lib/features/companion/presentation/widgets/incoming_request_card.dart`
- Modify: `apps/mobile/lib/features/companion/presentation/screens/requests_tab.dart`

- [ ] **Step 1: Create companion requests ViewModel**

Write `features/companion/presentation/view_models/companion_requests_view_model.dart`:

```dart
import 'dart:async';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../client/data/datasources/request_api_datasource.dart';
import '../../../client/data/repositories/request_repository_impl.dart';
import '../../../client/domain/entities/service_request.dart';
import '../../../client/domain/repositories/request_repository.dart';
import '../../../../core/di/providers.dart';
import '../../../../core/ws/ws_event.dart';
import '../../../../core/ws/ws_provider.dart';

part 'companion_requests_view_model.g.dart';

@riverpod
class CompanionRequestsList extends _$CompanionRequestsList {
  StreamSubscription? _wsSub;

  @override
  Future<List<ServiceRequest>> build() async {
    final repo = ref.read(requestRepositoryProvider);
    final ws = ref.read(webSocketConnectionProvider);
    
    _wsSub = ws.events.listen((event) {
      if (event is RequestPending || event is RequestAccepted || event is RequestRejected) {
        ref.invalidateSelf();
      }
    });

    ref.onDispose(() => _wsSub?.cancel());
    return repo.getCompanionRequests();
  }
}

@riverpod
RequestRepository requestRepository(Ref ref) {
  final dio = ref.read(dioProvider);
  return RequestRepositoryImpl(RequestApiDatasource(dio));
}

@riverpod
class RequestAction extends _$RequestAction {
  @override
  AsyncValue<void> build() => const AsyncValue.data(null);

  Future<ServiceRequest> accept(String requestId) async {
    state = const AsyncLoading();
    try {
      final repo = ref.read(requestRepositoryProvider);
      final result = await repo.acceptRequest(requestId);
      state = const AsyncValue.data(null);
      return result;
    } catch (e, st) {
      state = AsyncError(e, st);
      rethrow;
    }
  }

  Future<ServiceRequest> reject(String requestId) async {
    state = const AsyncLoading();
    try {
      final repo = ref.read(requestRepositoryProvider);
      final result = await repo.rejectRequest(requestId);
      state = const AsyncValue.data(null);
      return result;
    } catch (e, st) {
      state = AsyncError(e, st);
      rethrow;
    }
  }
}
```

- [ ] **Step 2: Create incoming request card widget**

Write `features/companion/presentation/widgets/incoming_request_card.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/extensions.dart';
import '../../../../shared/widgets/contigo_button.dart';
import '../../../../shared/widgets/contigo_card.dart';
import '../../../client/domain/entities/service_request.dart';
import '../../../client/domain/entities/request_status.dart';
import '../view_models/companion_requests_view_model.dart';

class IncomingRequestCard extends ConsumerWidget {
  final ServiceRequest request;

  const IncomingRequestCard({super.key, required this.request});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.contigoColors;
    final isPending = request.status == RequestStatus.pending;

    return ContigoCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.person, color: colors.primary, size: 20),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  request.fullName,
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        color: colors.onSurface,
                      ),
                ),
              ),
              _StatusBadge(status: request.status),
            ],
          ),
          const SizedBox(height: 12),
          _InfoRow(icon: Icons.category, label: request.serviceType),
          if (request.address != null)
            _InfoRow(icon: Icons.location_on, label: request.address!),
          if (request.preferredDate != null)
            _InfoRow(icon: Icons.calendar_today, label: request.preferredDate!),
          if (request.notes != null && request.notes!.isNotEmpty)
            _InfoRow(icon: Icons.notes, label: request.notes!),
          if (isPending) ...[
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ContigoButton(
                    label: 'Rechazar',
                    variant: ContigoButtonVariant.secondary,
                    onPressed: () => ref.read(requestActionProvider.notifier).reject(request.id),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ContigoButton(
                    label: 'Aceptar',
                    onPressed: () => ref.read(requestActionProvider.notifier).accept(request.id),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label;

  const _InfoRow({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        children: [
          Icon(icon, size: 14, color: colors.onSurfaceVariant),
          const SizedBox(width: 8),
          Expanded(
            child: Text(label, style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: colors.onSurfaceVariant,
            )),
          ),
        ],
      ),
    );
  }
}

class _StatusBadge extends StatelessWidget {
  final RequestStatus status;

  const _StatusBadge({required this.status});

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;
    final (label, bgColor, textColor) = switch (status) {
      RequestStatus.pending => ('Pendiente', colors.tertiaryContainer, colors.onTertiaryContainer),
      RequestStatus.accepted => ('Aceptada', colors.primaryContainer, colors.onPrimaryContainer),
      RequestStatus.rejected => ('Rechazada', colors.errorContainer, colors.onErrorContainer),
      _ => ('', colors.surfaceContainer, colors.onSurfaceVariant),
    };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(label, style: TextStyle(fontSize: 12, color: textColor)),
    );
  }
}
```

- [ ] **Step 3: Update companion requests tab**

Edit `features/companion/presentation/screens/requests_tab.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/extensions.dart';
import '../../../../shared/widgets/contigo_empty_state.dart';
import '../../../client/domain/entities/service_request.dart';
import '../view_models/companion_requests_view_model.dart';
import '../widgets/incoming_request_card.dart';

class CompanionRequestsTab extends ConsumerWidget {
  const CompanionRequestsTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.contigoColors;
    final requestsAsync = ref.watch(companionRequestsListProvider);

    return Scaffold(
      backgroundColor: colors.surface,
      appBar: AppBar(title: const Text('Solicitudes')),
      body: requestsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => ContigoEmptyState(
          icon: Icons.error_outline,
          title: 'Error al cargar',
          subtitle: e.toString(),
        ),
        data: (requests) {
          if (requests.isEmpty) {
            return const ContigoEmptyState(
              icon: Icons.inbox_outlined,
              title: 'Aún no hay solicitudes',
              subtitle: 'Las solicitudes de servicio aparecerán aquí.',
            );
          }
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: requests.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) =>
                IncomingRequestCard(request: requests[index]),
          );
        },
      ),
    );
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/mobile/lib/features/companion/presentation/view_models/ apps/mobile/lib/features/companion/presentation/widgets/ apps/mobile/lib/features/companion/presentation/screens/requests_tab.dart
git commit -m "feat(mobile): add companion requests screen with accept/reject"
```

---

### Task 11: Mobile — Update client requests screen with live data

**Files:**
- Modify: `apps/mobile/lib/features/client/presentation/screens/my_requests_screen.dart`

- [ ] **Step 1: Create client requests ViewModel**

Create `features/client/presentation/view_models/client_requests_view_model.dart`:

```dart
import 'dart:async';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../data/datasources/request_api_datasource.dart';
import '../../data/repositories/request_repository_impl.dart';
import '../../domain/entities/service_request.dart';
import '../../domain/repositories/request_repository.dart';
import '../../../../core/di/providers.dart';
import '../../../../core/ws/ws_event.dart';
import '../../../../core/ws/ws_provider.dart';

part 'client_requests_view_model.g.dart';

@riverpod
class ClientRequestsList extends _$ClientRequestsList {
  StreamSubscription? _wsSub;

  @override
  Future<List<ServiceRequest>> build() async {
    final repo = ref.read(clientRequestRepositoryProvider);
    final ws = ref.read(webSocketConnectionProvider);

    _wsSub = ws.events.listen((event) {
      if (event is RequestAccepted || event is RequestRejected) {
        ref.invalidateSelf();
      }
    });

    ref.onDispose(() => _wsSub?.cancel());
    return repo.getMyRequests();
  }
}

@riverpod
RequestRepository clientRequestRepository(Ref ref) {
  final dio = ref.read(dioProvider);
  return RequestRepositoryImpl(RequestApiDatasource(dio));
}
```

- [ ] **Step 2: Update MyRequestsScreen**

Edit `features/client/presentation/screens/my_requests_screen.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/extensions.dart';
import '../../../../core/router/routes.dart';
import '../../../../core/ws/ws_event.dart';
import '../../../../shared/widgets/contigo_button.dart';
import '../../../../shared/widgets/contigo_card.dart';
import '../../../../shared/widgets/contigo_empty_state.dart';
import '../../../../shared/widgets/contigo_status_pill.dart';
import '../../domain/entities/request_status.dart';
import '../../domain/entities/service_request.dart';
import '../view_models/client_requests_view_model.dart';

class MyRequestsScreen extends ConsumerWidget {
  const MyRequestsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.contigoColors;
    final requestsAsync = ref.watch(clientRequestsListProvider);

    return Scaffold(
      backgroundColor: colors.surface,
      appBar: AppBar(
        backgroundColor: colors.surface,
        title: const Text('Mis Solicitudes'),
      ),
      body: requestsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => ContigoEmptyState(
          icon: Icons.error_outline,
          title: 'Error al cargar',
          subtitle: e.toString(),
          actionLabel: 'Reintentar',
          onAction: () => ref.invalidate(clientRequestsListProvider),
        ),
        data: (requests) => requests.isEmpty
            ? ContigoEmptyState(
                icon: Icons.assignment_outlined,
                title: 'No tienes solicitudes aún',
                subtitle: 'Tus solicitudes de servicio aparecerán aquí.',
                actionLabel: 'Solicitar un servicio',
                onAction: () => context.go(AppRoutes.services),
              )
            : ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: requests.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, index) =>
                    _RequestCard(request: requests[index]),
              ),
      ),
    );
  }
}

class _RequestCard extends StatelessWidget {
  final ServiceRequest request;

  const _RequestCard({required this.request});

  @override
  Widget build(BuildContext context) {
    final colors = context.contigoColors;
    return ContigoCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.assignment, color: colors.primary, size: 20),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  request.serviceType,
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        color: colors.onSurface,
                      ),
                ),
              ),
              ContigoStatusPill(status: request.status),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            request.fullName,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: colors.onSurfaceVariant,
                ),
          ),
          const SizedBox(height: 12),
          Divider(color: colors.outlineVariant, height: 1, thickness: 0.5),
          const SizedBox(height: 12),
          Row(
            children: [
              Icon(Icons.calendar_today, size: 14, color: colors.onSurfaceVariant),
              const SizedBox(width: 8),
              Text(
                request.preferredDate ?? '',
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: colors.onSurfaceVariant,
                    ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/mobile/lib/features/client/presentation/
git commit -m "feat(mobile): live client requests screen with WebSocket updates"
```

---

### Task 12: Mobile — Wire up DI providers and create .env

**Files:**
- Modify: `apps/mobile/lib/core/di/providers.dart`
- Create: `apps/mobile/.env`

- [ ] **Step 1: Update providers.dart**

Add the WS provider export to `core/di/providers.dart`:

```dart
export '../ws/ws_provider.dart';
```

- [ ] **Step 2: Create .env for mobile**

Create `apps/mobile/.env`:

```env
API_BASE_URL=http://localhost:8080/api/v1
WS_BASE_URL=ws://localhost:8080/api/v1
```

- [ ] **Step 3: Build to verify**

Run: `cd apps/mobile && flutter analyze`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add apps/mobile/lib/core/di/providers.dart apps/mobile/.env
git commit -m "feat(mobile): wire up providers and add .env config"
```

---

### Task 13: Backend — Run migrations locally

- [ ] **Step 1: Create .env file for backend**

Create `apps/backend/configs/.env`:

```env
SERVER_PORT=8080
DATABASE_URL=file:./contigo.db
CLERK_JWKS_URL=
CLERK_ISSUER=
APP_ENV=development
LOG_LEVEL=debug
```

- [ ] **Step 2: Build and run backend**

Run from `apps/backend/`:

```bash
cd apps/backend && go run cmd/server/main.go
```

Expected: server starts, migrations run, `service_requests` table created.

- [ ] **Step 3: Test manually with curl**

```bash
# Create a request (no auth for dev)
curl -X POST http://localhost:8080/api/v1/requests \
  -H "Content-Type: application/json" \
  -d '{"companion_id":"user_456","service_type":"accompaniment","full_name":"Juan","phone":"56912345678","address":"Av. Providencia","preferred_date":"2025-07-30T18:00"}'
```

- [ ] **Step 4: Commit .env**

```bash
git add apps/backend/configs/.env
git commit -m "chore: add backend .env for local development"
```

---

## Self-Review Checklist

1. **Spec coverage:**
   - Service requests table ✅ (Task 1)
   - Domain entity + repository interface ✅ (Task 2)
   - Repository impl ✅ (Task 3)
   - WebSocket hub ✅ (Task 4)
   - Use case + handlers + routes ✅ (Task 5)
   - Wiring in main.go ✅ (Task 6)
   - Mobile domain entities updated ✅ (Task 7)
   - Mobile datasource + repo updated ✅ (Task 8)
   - Mobile WS provider ✅ (Task 9)
   - Companion requests screen ✅ (Task 10)
   - Client requests screen ✅ (Task 11)
   - DI + .env ✅ (Task 12)
   - Run migrations + test ✅ (Task 13)

2. **Placeholder scan:** No TBDs, TODOs, or placeholders. All code is inline.

3. **Type consistency:** Backend entity fields match db columns. Mobile ServiceRequest fields match backend JSON. WebSocket event types match between hub and mobile.

4. **Scope check:** Focused on one feature — service request matching with real-time WebSocket. No payment, no ratings, no other features.

## Execution Handoff

Plan complete. Two execution options:

1. **Subagent-Driven (recommended)** — dispatch a fresh subagent per task with review between tasks
2. **Inline Execution** — execute tasks in this session batch with checkpoints

Which approach?
