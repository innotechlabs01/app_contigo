package turso

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"go.uber.org/zap"

	"github.com/contigo/backend/pkg/logger"
)

// Migrator handles database migrations.
type Migrator struct {
	pool Pool
}

// NewMigrator creates a new Migrator.
func NewMigrator(pool Pool) *Migrator {
	return &Migrator{pool: pool}
}

// Up runs all pending migrations.
func (m *Migrator) Up(ctx context.Context, migrationsDir string) error {
	conn, err := m.pool.Conn(ctx)
	if err != nil {
		return fmt.Errorf("failed to get connection: %w", err)
	}
	defer conn.Close()

	// Create migrations table if not exists
	_, err = conn.ExecContext(ctx, `
		CREATE TABLE IF NOT EXISTS schema_migrations (
			version INTEGER PRIMARY KEY,
			applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`)
	if err != nil {
		return fmt.Errorf("failed to create migrations table: %w", err)
	}

	// Read migration files
	entries, err := os.ReadDir(migrationsDir)
	if err != nil {
		return fmt.Errorf("failed to read migrations directory: %w", err)
	}

	var migrationFiles []string
	for _, entry := range entries {
		if !entry.IsDir() && strings.HasSuffix(entry.Name(), ".up.sql") {
			migrationFiles = append(migrationFiles, entry.Name())
		}
	}
	sort.Strings(migrationFiles)

	for _, file := range migrationFiles {
		// Extract version from filename (e.g., 000001_create_users.up.sql)
		version := strings.Split(file, "_")[0]

		// Check if already applied
		var count int
		err := conn.QueryRowContext(ctx,
			"SELECT COUNT(*) FROM schema_migrations WHERE version = ?", version,
		).Scan(&count)
		if err != nil {
			return fmt.Errorf("failed to check migration: %w", err)
		}

		if count > 0 {
			continue
		}

		// Read migration file
		content, err := os.ReadFile(filepath.Join(migrationsDir, file))
		if err != nil {
			return fmt.Errorf("failed to read migration file %s: %w", file, err)
		}

		// Execute migration
		_, err = conn.ExecContext(ctx, string(content))
		if err != nil {
			return fmt.Errorf("failed to execute migration %s: %w", file, err)
		}

		// Record migration
		_, err = conn.ExecContext(ctx,
			"INSERT INTO schema_migrations (version) VALUES (?)", version,
		)
		if err != nil {
			return fmt.Errorf("failed to record migration %s: %w", file, err)
		}

		logger.Info("Applied migration", zap.String("file", file))
	}

	return nil
}

// Down rolls back the last migration.
func (m *Migrator) Down(ctx context.Context, migrationsDir string) error {
	conn, err := m.pool.Conn(ctx)
	if err != nil {
		return fmt.Errorf("failed to get connection: %w", err)
	}
	defer conn.Close()

	// Get last applied migration
	var version string
	err = conn.QueryRowContext(ctx,
		"SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1",
	).Scan(&version)
	if err != nil {
		return fmt.Errorf("no migrations to rollback: %w", err)
	}

	// Find and execute down migration
	downFile := filepath.Join(migrationsDir, version+"_*.down.sql")
	entries, err := filepath.Glob(downFile)
	if err != nil || len(entries) == 0 {
		return fmt.Errorf("down migration not found for version %s", version)
	}

	content, err := os.ReadFile(entries[0])
	if err != nil {
		return fmt.Errorf("failed to read down migration: %w", err)
	}

	_, err = conn.ExecContext(ctx, string(content))
	if err != nil {
		return fmt.Errorf("failed to execute down migration: %w", err)
	}

	// Remove migration record
	_, err = conn.ExecContext(ctx,
		"DELETE FROM schema_migrations WHERE version = ?", version,
	)
	if err != nil {
		return fmt.Errorf("failed to remove migration record: %w", err)
	}

	logger.Info("Rolled back migration", zap.String("version", version))
	return nil
}
