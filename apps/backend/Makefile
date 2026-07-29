.PHONY: build run test test-verbose lint fmt fmt-check migrate-up migrate-down swagger clean docker-build docker-run

# Build the application
build:
	go build -o bin/server ./cmd/server

# Run the application
run:
	go run ./cmd/server

# Run all tests
test:
	go test -race -coverprofile=coverage.out ./...

# Run tests with verbose output
test-verbose:
	go test -race -v -coverprofile=coverage.out ./...

# Run tests for a specific package
test-pkg:
	go test -race -v ./internal/...

# Run linter
lint:
	golangci-lint run

# Format code
fmt:
	gofumpt -w .

# Check formatting
fmt-check:
	test -z "$(gofumpt -l .)"

# Run database migrations up
migrate-up:
	./scripts/migrate.sh up

# Run database migrations down
migrate-down:
	./scripts/migrate.sh down

# Generate swagger documentation
swagger:
	./scripts/swagger.sh

# Build Docker image
docker-build:
	docker build -t contigo-backend -f deploy/docker/Dockerfile .

# Run with Docker Compose
docker-run:
	docker compose -f deploy/docker/docker-compose.yml up --build

# Stop Docker Compose
docker-stop:
	docker compose -f deploy/docker/docker-compose.yml down

# Clean build artifacts
clean:
	rm -rf bin/ coverage.out docs/swagger/

# Download dependencies
deps:
	go mod download

# Verify dependencies
deps-verify:
	go mod verify

# Tidy dependencies
deps-tidy:
	go mod tidy

# Run all checks (lint, fmt, test)
check: fmt-check lint test

# Development mode with hot reload (requires air)
dev:
	air -c .air.toml

# Help
help:
	@echo "Available commands:"
	@echo "  build         - Build the application"
	@echo "  run           - Run the application"
	@echo "  test          - Run all tests"
	@echo "  test-verbose  - Run tests with verbose output"
	@echo "  lint          - Run linter"
	@echo "  fmt           - Format code"
	@echo "  fmt-check     - Check formatting"
	@echo "  migrate-up    - Run database migrations up"
	@echo "  migrate-down  - Run database migrations down"
	@echo "  swagger       - Generate swagger documentation"
	@echo "  docker-build  - Build Docker image"
	@echo "  docker-run    - Run with Docker Compose"
	@echo "  docker-stop   - Stop Docker Compose"
	@echo "  clean         - Clean build artifacts"
	@echo "  deps          - Download dependencies"
	@echo "  deps-verify   - Verify dependencies"
	@echo "  deps-tidy     - Tidy dependencies"
	@echo "  check         - Run all checks"
	@echo "  dev           - Development mode with hot reload"
	@echo "  help          - Show this help"
