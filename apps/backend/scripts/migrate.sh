#!/bin/bash

set -e

MIGRATIONS_DIR="./infrastructure/database/migration/migrations"

case "$1" in
  up)
    echo "Running migrations up..."
    for file in $(ls $MIGRATIONS_DIR/*.up.sql 2>/dev/null | sort); do
      echo "Applying: $file"
      # Execute migration using turso CLI or database client
      # turso db shell <database> < $file
    done
    echo "Migrations complete."
    ;;
  down)
    echo "Running migrations down..."
    for file in $(ls $MIGRATIONS_DIR/*.down.sql 2>/dev/null | sort -r); do
      echo "Rolling back: $file"
      # Execute migration using turso CLI or database client
      # turso db shell <database> < $file
    done
    echo "Rollback complete."
    ;;
  *)
    echo "Usage: $0 {up|down}"
    exit 1
    ;;
esac
