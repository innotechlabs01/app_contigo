# Contigo Backend

Enterprise-grade Go backend for the Contigo healthcare platform.

## Architecture

- **Clean Architecture + DDD** — Domain-driven design with strict layer separation
- **Modular Monolith** — Self-contained modules, easy extraction to microservices
- **Manual DI** — No code generation, explicit dependency wiring

## Tech Stack

- Go 1.24
- Fiber v3 (HTTP framework)
- Viper (configuration)
- Zap (structured logging)
- go-playground/validator (validation)
- Clerk (JWT authentication)
- TursoDB/libSQL (database)
- Docker + Docker Compose

## Project Structure

```
cmd/server/          # Entry point, DI wiring
internal/            # Business modules (auth, users, organizations, etc.)
infrastructure/      # Database, auth, cache, storage adapters
pkg/                 # Shared utilities (errors, response, logger, validator)
configs/             # Configuration
deploy/docker/       # Docker configuration
.github/workflows/   # CI/CD
```

## Getting Started

### Prerequisites

- Go 1.24+
- Docker & Docker Compose (optional)

### Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and configure
3. Install dependencies:
   ```bash
   go mod download
   ```
4. Run the server:
   ```bash
   make run
   ```

### Docker

```bash
# Build and run with Docker Compose
make docker-run

# Stop
make docker-stop
```

## Development

### Commands

```bash
make build          # Build the application
make run            # Run the application
make test           # Run all tests
make lint           # Run linter
make fmt            # Format code
make fmt-check      # Check formatting
make check          # Run all checks (lint, fmt, test)
make help           # Show all commands
```

### Code Quality

- **golangci-lint** — Linting
- **gofumpt** — Code formatting
- **80% test coverage** target

## API

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness check |
| GET | `/readiness` | Readiness check |
| GET | `/api/v1/swagger/*` | Swagger documentation |

### Response Format

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
        "message": "Resource not found"
    }
}
```

## Modules

- [x] Auth (Clerk JWT)
- [x] Users
- [x] Organizations
- [x] Roles
- [x] Permissions
- [x] Files
- [x] Notifications
- [x] Audit Logs
- [x] Health
- [x] Settings

## License

MIT License
