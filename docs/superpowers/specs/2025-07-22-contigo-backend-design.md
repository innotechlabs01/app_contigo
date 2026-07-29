# Contigo Backend Foundation — Design Spec

## Overview

Enterprise-grade Go backend foundation for the Contigo healthcare platform. Clean Architecture + DDD, modular monolith, production-ready from day one.

**Tech Stack:**
- Go 1.24 (latest stable)
- Fiber v3 (HTTP framework)
- Viper (configuration)
- Zap (structured logging)
- go-playground/validator (validation)
- Clerk (JWT authentication via JWKS)
- TursoDB/libSQL (database)
- golang-migrate (migrations)
- Manual DI (no code generation)
- testify + gomock (testing)
- OpenAPI 3 / Swagger (documentation)
- Docker + Docker Compose (containerization)
- GitHub Actions (CI/CD)
- golangci-lint + gofumpt (code quality)

---

## Architecture

### Pattern: Monolithic Clean Architecture

Single Go binary with clean layered architecture. Each module (auth, users, organizations) is self-contained within the same binary. Future extraction to microservices is trivial due to clean module boundaries.

### Layers

1. **Domain** — Business entities, repository interfaces, domain services, domain events, typed errors. Zero external dependencies.
2. **Application** — Use cases, DTOs, application services. Orchestrates domain objects.
3. **Interfaces** — HTTP handlers, middleware, request/response DTOs. Adapts external world to application layer.
4. **Infrastructure** — Database implementations, external service adapters (Clerk, R2), cache, events. Implements domain interfaces.
5. **Config** — Viper configuration loading, environment variables.
6. **Pkg** — Shared utilities (logger, errors, response, validator).

### Dependency Rule

Dependencies point inward only: `interfaces → application → domain`. Domain never depends on infrastructure. Infrastructure implements domain interfaces.

---

## Project Structure

```
contigo-backend/
├── cmd/
│   └── server/
│       ├── main.go              # Entry point, Fiber init, DI wiring
│       └── wire.go              # Manual DI functions
├── internal/
│   ├── auth/                    # Authentication module
│   │   ├── domain/
│   │   │   ├── entity/
│   │   │   ├── repository/      # Repository interfaces
│   │   │   ├── service/
│   │   │   ├── error/
│   │   │   └── event/
│   │   ├── application/
│   │   │   ├── usecase/
│   │   │   └── dto/
│   │   └── interfaces/
│   │       ├── http/
│   │       │   ├── handler/
│   │       │   ├── route/
│   │       │   └── dto/         # Request/Response DTOs
│   │       └── middleware/
│   ├── users/                   # Same structure as auth
│   ├── organizations/
│   ├── roles/
│   ├── permissions/
│   ├── files/
│   ├── notifications/
│   ├── audit/
│   ├── health/
│   └── settings/
├── infrastructure/
│   ├── database/
│   │   ├── turso/               # TursoDB implementation
│   │   │   ├── pool.go          # Pool interface impl
│   │   │   ├── conn.go          # Connection wrapper
│   │   │   └── migration.go     # Migration runner
│   │   └── migration/
│   │       └── migrations/      # SQL migration files
│   ├── auth/
│   │   └── clerk/               # Clerk JWT verification
│   │       ├── verifier.go      # JWT verification via JWKS
│   │       └── context.go       # User context extraction
│   ├── cache/
│   │   └── memory/              # In-memory cache (start)
│   ├── events/
│   │   └── memory/              # In-memory event bus (start)
│   └── storage/
│       ├── r2/                  # Cloudflare R2 adapter
│       └── local/               # Local file storage adapter
├── pkg/
│   ├── logger/
│   │   ├── logger.go            # Zap logger setup
│   │   └── context.go           # Correlation ID from context
│   ├── errors/
│   │   ├── errors.go            # Typed AppError
│   │   └── codes.go             # Error code constants
│   ├── response/
│   │   └── response.go          # Standard JSON response
│   ├── validator/
│   │   └── validator.go         # go-playground/validator wrapper
│   └── utils/
│       └── utils.go             # General utilities
├── configs/
│   ├── config.go                # Viper configuration loader
│   ├── config_test.go           # Config tests
│   └── .env.example             # Example environment variables
├── deploy/
│   └── docker/
│       ├── Dockerfile           # Multi-stage build
│       └── docker-compose.yml   # Local development stack
├── scripts/
│   ├── migrate.sh               # Database migration script
│   └── swagger.sh               # Swagger generation script
├── tests/
│   └── integration/             # Integration tests
├── docs/
│   └── swagger/                 # Generated OpenAPI docs
├── .github/
│   └── workflows/
│       ├── ci.yml               # CI pipeline
│       └── lint.yml             # Linting pipeline
├── go.mod
├── go.sum
├── Makefile                     # Build, test, lint commands
├── .golangci.yml                # Linter configuration
├── .gofumpt.yml                 # Formatter configuration
└── README.md
```

---

## Module Structure (Template)

Each module follows this structure:

```
module/
├── domain/
│   ├── entity/
│   │   └── entity.go            # Domain entities
│   ├── repository/
│   │   └── repository.go        # Repository interfaces
│   ├── service/
│   │   └── service.go           # Domain services
│   ├── error/
│   │   └── error.go             # Module-specific errors
│   └── event/
│       └── event.go             # Domain events
├── application/
│   ├── usecase/
│   │   └── usecase.go           # Use cases (business logic)
│   └── dto/
│       └── dto.go               # Data transfer objects
└── interfaces/
    ├── http/
    │   ├── handler/
    │   │   └── handler.go       # HTTP handlers
    │   ├── route/
    │   │   └── route.go         # Route registration
    │   └── dto/
    │       ├── request.go       # Request DTOs
    │       └── response.go      # Response DTOs
    └── middleware/
        └── middleware.go         # Module-specific middleware
```

---

## Core Packages

### `pkg/errors` — Typed Error Package

```go
package errors

import "fmt"

type AppError struct {
    Code    string `json:"code"`
    Message string `json:"message"`
    Err     error  `json:"-"`
}

func (e *AppError) Error() string {
    if e.Err != nil {
        return fmt.Sprintf("%s: %s: %v", e.Code, e.Message, e.Err)
    }
    return fmt.Sprintf("%s: %s", e.Code, e.Message)
}

func (e *AppError) Unwrap() error {
    return e.Err
}

func New(code string, message string) *AppError {
    return &AppError{Code: code, Message: message}
}

func Wrap(err error, code string, message string) *AppError {
    return &AppError{Code: code, Message: message, Err: err}
}

// Error codes
const (
    ErrCodeNotFound         = "NOT_FOUND"
    ErrCodeUnauthorized     = "UNAUTHORIZED"
    ErrCodeForbidden        = "FORBIDDEN"
    ErrCodeValidation       = "VALIDATION_ERROR"
    ErrCodeInternal         = "INTERNAL_ERROR"
    ErrCodeConflict         = "CONFLICT"
    ErrCodeRateLimited      = "RATE_LIMITED"
    ErrCodeBadRequest       = "BAD_REQUEST"
)
```

### `pkg/response` — Standard JSON Response

```go
package response

import (
    "encoding/json"
    "net/http"

    apperr "github.com/contigo/backend/pkg/errors"
)

type Response struct {
    Success bool        `json:"success"`
    Data    interface{} `json:"data,omitempty"`
    Error   *ErrorBody  `json:"error,omitempty"`
}

type ErrorBody struct {
    Code    string `json:"code"`
    Message string `json:"message"`
}

func Success(w http.ResponseWriter, status int, data interface{}) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(Response{
        Success: true,
        Data:    data,
    })
}

func Error(w http.ResponseWriter, status int, err *apperr.AppError) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(Response{
        Success: false,
        Error: &ErrorBody{
            Code:    err.Code,
            Message: err.Message,
        },
    })
}
```

### `pkg/logger` — Zap Structured Logger

```go
package logger

import (
    "context"

    "go.uber.org/zap"
)

type contextKey string

const loggerKey contextKey = "logger"

var global *zap.Logger

func Init(level string) error {
    var err error
    global, err = zap.NewProduction()
    if err != nil {
        return err
    }
    return nil
}

func WithContext(ctx context.Context) *zap.Logger {
    if l, ok := ctx.Value(loggerKey).(*zap.Logger); ok {
        return l
    }
    return global
}

func FromContext(ctx context.Context) *zap.Logger {
    return WithContext(ctx)
}

func ToContext(ctx context.Context, l *zap.Logger) context.Context {
    return context.WithValue(ctx, loggerKey, l)
}
```

### `pkg/validator` — Custom Validation

```go
package validator

import (
    "fmt"
    "strings"

    "github.com/go-playground/validator/v10"

    apperr "github.com/contigo/backend/pkg/errors"
)

var validate *validator.Validate

func Init() {
    validate = validator.New()
}

func Validate(s interface{}) *apperr.AppError {
    if err := validate.Struct(s); err != nil {
        var errs []string
        for _, e := range err.(validator.ValidationErrors) {
            errs = append(errs, fmt.Sprintf("%s: %s", e.Field(), e.Tag()))
        }
        return apperr.New(
            apperr.ErrCodeValidation,
            strings.Join(errs, "; "),
        )
    }
    return nil
}
```

---

## Middleware Stack

```
Request → Recovery → Logger → RequestID → CORS → Auth → Validation → Handler
```

| Middleware | Package | Purpose |
|------------|---------|---------|
| Recovery | `fiber/middleware/recover` | Catches panics, returns 500 |
| Logger | `fiber/middleware/logger` | Structured request/response logging |
| Request ID | `fiber/middleware/requestid` | Generates/propagates correlation ID |
| CORS | `fiber/middleware/cors` | Cross-origin resource sharing |
| Auth | `internal/auth/interfaces/middleware` | Clerk JWT verification, sets user context |
| Validation | Custom | Request body/query validation |

### Authentication Middleware

```go
// internal/auth/interfaces/middleware/auth.go
func AuthMiddleware(verifier clerk.Verifier) fiber.Handler {
    return func(c *fiber.Ctx) error {
        token := c.Get("Authorization")
        if token == "" {
            return c.Status(401).JSON(response.Error{
                Success: false,
                Error: &response.ErrorBody{
                    Code:    "UNAUTHORIZED",
                    Message: "Missing authorization header",
                },
            })
        }

        claims, err := verifier.Verify(token)
        if err != nil {
            return c.Status(401).JSON(response.Error{
                Success: false,
                Error: &response.ErrorBody{
                    Code:    "UNAUTHORIZED",
                    Message: "Invalid token",
                },
            })
        }

        // Set user context
        c.Locals("user_id", claims.UserID)
        c.Locals("org_id", claims.OrgID)
        c.Locals("roles", claims.Roles)

        return c.Next()
    }
}
```

---

## Database Layer

### Pool Interface

```go
// infrastructure/database/turso/pool.go
package turso

import (
    "context"
    "database/sql"
)

type Pool interface {
    Conn(ctx context.Context) (Conn, error)
    Close() error
}

type Conn interface {
    ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error)
    QueryContext(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error)
    QueryRowContext(ctx context.Context, query string, args ...interface{}) *sql.Row
    BeginTx(ctx context.Context, opts *sql.TxOptions) (Tx, error)
}

type Tx interface {
    ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error)
    QueryContext(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error)
    QueryRowContext(ctx context.Context, query string, args ...interface{}) *sql.Row
    Commit() error
    Rollback() error
}
```

### Repository Pattern

```go
// domain/repository/user_repository.go
package repository

import (
    "context"
    "github.com/contigo/backend/internal/users/domain/entity"
)

type UserRepository interface {
    FindByID(ctx context.Context, id string) (*entity.User, error)
    FindByEmail(ctx context.Context, email string) (*entity.User, error)
    Create(ctx context.Context, user *entity.User) error
    Update(ctx context.Context, user *entity.User) error
    Delete(ctx context.Context, id string) error
}

// infrastructure/database/turso/user_repository.go
package turso

import (
    "context"
    "github.com/contigo/backend/internal/users/domain/entity"
    "github.com/contigo/backend/internal/users/domain/repository"
)

type UserRepositoryImpl struct {
    pool Pool
}

func NewUserRepository(pool Pool) repository.UserRepository {
    return &UserRepositoryImpl{pool: pool}
}

func (r *UserRepositoryImpl) FindByID(ctx context.Context, id string) (*entity.User, error) {
    conn, err := r.pool.Conn(ctx)
    if err != nil {
        return nil, err
    }
    defer conn.Close()

    var user entity.User
    err = conn.QueryRowContext(ctx,
        "SELECT id, email, name, created_at FROM users WHERE id = ?", id,
    ).Scan(&user.ID, &user.Email, &user.Name, &user.CreatedAt)
    if err != nil {
        return nil, err
    }
    return &user, nil
}
```

---

## Authentication Flow

```
Client → Clerk SDK → JWT Token (Bearer header)
       ↓
Server → Auth Middleware → Extract token from Authorization header
       ↓
Verify JWT using Clerk JWKS endpoint (cached)
       ↓
Extract claims: user_id, org_id, roles, permissions
       ↓
Set in Fiber context: c.Locals("user_id", ...)
       ↓
Handler reads from context
```

### JWKS Verification

```go
// infrastructure/auth/clerk/verifier.go
package clerk

import (
    "context"
    "crypto/rsa"
    "encoding/json"
    "fmt"
    "net/http"
    "sync"
    "time"

    "github.com/golang-jwt/jwt/v5"
)

type Verifier interface {
    Verify(tokenString string) (*Claims, error)
}

type Claims struct {
    UserID string   `json:"sub"`
    OrgID  string   `json:"org_id"`
    Roles  []string `json:"roles"`
    jwt.RegisteredClaims
}

type JWKSVerifier struct {
    jwksURL    string
    httpClient *http.Client
    mu         sync.RWMutex
    keys       map[string]*rsa.PublicKey
    lastFetch  time.Time
}

func NewJWKSVerifier(jwksURL string) *JWKSVerifier {
    return &JWKSVerifier{
        jwksURL: jwksURL,
        httpClient: &http.Client{
            Timeout: 10 * time.Second,
        },
        keys: make(map[string]*rsa.PublicKey),
    }
}

func (v *JWKSVerifier) Verify(tokenString string) (*Claims, error) {
    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(t *jwt.Token) (interface{}, error) {
        kid, ok := t.Header["kid"].(string)
        if !ok {
            return nil, fmt.Errorf("missing kid in token header")
        }

        key, err := v.getKey(kid)
        if err != nil {
            return nil, err
        }
        return key, nil
    })
    if err != nil {
        return nil, err
    }

    claims, ok := token.Claims.(*Claims)
    if !ok || !token.Valid {
        return nil, fmt.Errorf("invalid token claims")
    }

    return claims, nil
}
```

---

## Configuration

### Viper Config Structure

```go
// configs/config.go
package config

import (
    "github.com/spf13/viper"
)

type Config struct {
    Server   ServerConfig   `mapstructure:"server"`
    Database DatabaseConfig `mapstructure:"database"`
    Auth     AuthConfig     `mapstructure:"auth"`
    Storage  StorageConfig  `mapstructure:"storage"`
    Cache    CacheConfig    `mapstructure:"cache"`
}

type ServerConfig struct {
    Host         string `mapstructure:"host"`
    Port         int    `mapstructure:"port"`
    ReadTimeout  int    `mapstructure:"read_timeout"`
    WriteTimeout int    `mapstructure:"write_timeout"`
}

type DatabaseConfig struct {
    URL             string `mapstructure:"url"`
    MaxOpenConns    int    `mapstructure:"max_open_conns"`
    MaxIdleConns    int    `mapstructure:"max_idle_conns"`
    ConnMaxLifetime int    `mapstructure:"conn_max_lifetime"`
}

type AuthConfig struct {
    ClerkJWKSURL  string `mapstructure:"clerk_jwks_url"`
    ClerkIssuer   string `mapstructure:"clerk_issuer"`
}

type StorageConfig struct {
    Provider string `mapstructure:"provider"` // "r2", "local"
    R2       R2Config
    Local    LocalConfig
}

type R2Config struct {
    AccountID  string `mapstructure:"account_id"`
    AccessKey  string `mapstructure:"access_key"`
    SecretKey  string `mapstructure:"secret_key"`
    BucketName string `mapstructure:"bucket_name"`
    PublicURL  string `mapstructure:"public_url"`
}

type LocalConfig struct {
    BasePath string `mapstructure:"base_path"`
    BaseURL  string `mapstructure:"base_url"`
}

type CacheConfig struct {
    Provider string `mapstructure:"provider"` // "memory", "redis"
}

func Load() (*Config, error) {
    viper.SetConfigName(".env")
    viper.SetConfigType("env")
    viper.AddConfigPath(".")
    viper.AddConfigPath("./configs")
    viper.AutomaticEnv()

    if err := viper.ReadInConfig(); err != nil {
        // .env file is optional
    }

    var cfg Config
    if err := viper.Unmarshal(&cfg); err != nil {
        return nil, err
    }

    return &cfg, nil
}
```

---

## Health Endpoints

### Liveness: `/health`

```go
// internal/health/interfaces/http/handler/health_handler.go
func (h *HealthHandler) Liveness(c *fiber.Ctx) error {
    return c.Status(fiber.StatusOK).JSON(fiber.Map{
        "status": "alive",
    })
}
```

### Readiness: `/readiness`

```go
func (h *HealthHandler) Readiness(c *fiber.Ctx) error {
    ctx := c.Context()

    // Check database
    if err := h.db.PingContext(ctx); err != nil {
        return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
            "status": "not ready",
            "error":  "database unavailable",
        })
    }

    return c.Status(fiber.StatusOK).JSON(fiber.Map{
        "status": "ready",
    })
}
```

---

## Docker Configuration

### Dockerfile (Multi-stage)

```dockerfile
# Build stage
FROM golang:1.24-alpine AS builder

RUN apk add --no-cache git

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /app/server ./cmd/server

# Runtime stage
FROM alpine:3.20

RUN apk add --no-cache ca-certificates tzdata

WORKDIR /app

COPY --from=builder /app/server .
COPY --from=builder /app/configs/.env.example .

EXPOSE 8080

CMD ["./server"]
```

### docker-compose.yml

```yaml
version: "3.8"

services:
  api:
    build:
      context: .
      dockerfile: deploy/docker/Dockerfile
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=libsql://turso:8080
    depends_on:
      - turso
    volumes:
      - .:/app

  turso:
    image: tursodatabase/libsql-server:latest
    ports:
      - "8081:8080"
    volumes:
      - turso-data:/data

volumes:
  turso-data:
```

---

## CI/CD (GitHub Actions)

### `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: "1.24"
      - name: Run golangci-lint
        uses: golangci/golangci-lint-action@v6
        with:
          version: latest
      - name: Check gofumpt
        run: |
          go install mvdan.cc/gofumpt@latest
          test -z "$(gofumpt -l .)"

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: "1.24"
      - name: Run tests
        run: go test -race -coverprofile=coverage.out ./...
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: coverage.out

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: "1.24"
      - name: Build
        run: go build -o bin/server ./cmd/server
```

---

## Makefile

```makefile
.PHONY: build run test lint fmt migrate swagger clean

build:
	go build -o bin/server ./cmd/server

run:
	go run ./cmd/server

test:
	go test -race -coverprofile=coverage.out ./...

test-verbose:
	go test -race -v -coverprofile=coverage.out ./...

lint:
	golangci-lint run

fmt:
	gofumpt -w .

fmt-check:
	test -z "$(gofumpt -l .)"

migrate-up:
	./scripts/migrate.sh up

migrate-down:
	./scripts/migrate.sh down

swagger:
	./scripts/swagger.sh

clean:
	rm -rf bin/ coverage.out docs/swagger/
```

---

## API Design

### Base URL

```
/api/v1/
```

### Standard Response

**Success:**
```json
{
    "success": true,
    "data": { ... }
}
```

**Error:**
```json
{
    "success": false,
    "error": {
        "code": "NOT_FOUND",
        "message": "User not found"
    }
}
```

### Endpoints (Foundation)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness check |
| GET | `/readiness` | Readiness check |
| GET | `/api/v1/swagger/*` | Swagger UI |

---

## Module Template

Each module starts with the foundation structure. Business logic is added in the implementation phase.

### Health Module (Implemented)

- `internal/health/domain/` — empty (no domain logic for health)
- `internal/health/application/` — empty
- `internal/health/interfaces/http/handler/health_handler.go` — liveness + readiness handlers
- `internal/health/interfaces/http/route/health_route.go` — route registration

### Auth Module (Foundation)

- `internal/auth/domain/entity/` — User, Session entities
- `internal/auth/domain/repository/` — SessionRepository interface
- `internal/auth/interfaces/middleware/auth.go` — Clerk JWT middleware
- `internal/auth/interfaces/middleware/org.go` — Organization context middleware

### Other Modules (Placeholder)

Each module gets the directory structure with placeholder files:
- `entity/entity.go` — entity definition
- `repository/repository.go` — interface definition
- `service/service.go` — empty service struct
- `handler/handler.go` — empty handler struct
- `route/route.go` — empty route registration

---

## Error Handling

### Error Mapping (HTTP Status)

| Error Code | HTTP Status |
|------------|-------------|
| NOT_FOUND | 404 |
| UNAUTHORIZED | 401 |
| FORBIDDEN | 403 |
| VALIDATION_ERROR | 400 |
| CONFLICT | 409 |
| RATE_LIMITED | 429 |
| INTERNAL_ERROR | 500 |
| BAD_REQUEST | 400 |

### Handler Error Response

```go
func mapError(err *apperr.AppError) (int, response.ErrorBody) {
    switch err.Code {
    case apperr.ErrCodeNotFound:
        return fiber.StatusNotFound, response.ErrorBody{Code: err.Code, Message: err.Message}
    case apperr.ErrCodeUnauthorized:
        return fiber.StatusUnauthorized, response.ErrorBody{Code: err.Code, Message: err.Message}
    case apperr.ErrCodeForbidden:
        return fiber.StatusForbidden, response.ErrorBody{Code: err.Code, Message: err.Message}
    case apperr.ErrCodeValidation:
        return fiber.StatusBadRequest, response.ErrorBody{Code: err.Code, Message: err.Message}
    case apperr.ErrCodeConflict:
        return fiber.StatusConflict, response.ErrorBody{Code: err.Code, Message: err.Message}
    default:
        return fiber.StatusInternalServerError, response.ErrorBody{Code: "INTERNAL_ERROR", Message: "An unexpected error occurred"}
    }
}
```

---

## Security

- OWASP Top 10 compliance
- Input validation on all endpoints
- Output sanitization (no sensitive data in responses)
- JWT verification on protected routes
- SQL injection prevention (parameterized queries)
- Rate limiting (foundation, configurable later)
- Security headers via middleware
- CORS policy (configurable)
- Secrets from environment variables only (no hardcoded credentials)

---

## Testing Strategy

- **Unit Tests:** Domain entities, use cases, validators, utility functions
- **Integration Tests:** Repository implementations, HTTP handlers
- **Table-Driven Tests:** All test cases use table-driven pattern
- **Mocks:** gomock for repository interfaces
- **Coverage Target:** 80% minimum

---

## Future Extraction Points

The modular structure allows extracting any module into a separate microservice:

1. Move module to its own `cmd/service-name/main.go`
2. Add gRPC/REST interface between services
3. Deploy independently

No code changes required in the module itself — only the deployment topology changes.

---

## Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Go version | 1.24 (latest stable) | Latest features, security patches |
| HTTP framework | Fiber v3 | Performance, Express-like API |
| DI | Manual | No code generation, full control |
| Database | TursoDB (libSQL) | SQLite-compatible, edge deployment |
| Connection pooling | Abstract interface | Future PostgreSQL migration |
| Auth | Clerk JWT (JWKS) | No external calls per request |
| File storage | Cloudflare R2 first | S3-compatible, no egress fees |
| Health checks | Liveness + readiness | K8s standard pattern |
| Deployment | Docker + K8s (future) | Container orchestration |
| Architecture | Monolithic Clean | Simple start, extract later |
