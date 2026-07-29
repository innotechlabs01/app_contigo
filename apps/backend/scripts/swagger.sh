#!/bin/bash

set -e

echo "Generating Swagger documentation..."

# Install swag if not installed
if ! command -v swag &> /dev/null; then
    echo "Installing swag..."
    go install github.com/swaggo/swag/cmd/swag@latest
fi

# Generate swagger
swag init -g cmd/server/main.go -o docs/swagger

echo "Swagger documentation generated at docs/swagger/"
