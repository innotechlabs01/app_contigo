package turso

import (
	"context"
	"database/sql"
)

// Pool abstracts database connection management.
// This interface allows swapping between TursoDB and PostgreSQL
// by only changing the infrastructure implementation.
type Pool interface {
	// Conn returns a database connection from the pool.
	Conn(ctx context.Context) (Conn, error)
	// Close closes the pool and releases all resources.
	Close() error
	// Ping checks if the database is reachable.
	Ping(ctx context.Context) error
}

// Conn abstracts a single database connection.
type Conn interface {
	ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error)
	QueryContext(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error)
	QueryRowContext(ctx context.Context, query string, args ...interface{}) *sql.Row
	BeginTx(ctx context.Context, opts *sql.TxOptions) (Tx, error)
	Close() error
}

// Tx abstracts a database transaction.
type Tx interface {
	ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error)
	QueryContext(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error)
	QueryRowContext(ctx context.Context, query string, args ...interface{}) *sql.Row
	Commit() error
	Rollback() error
}
