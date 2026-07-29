package turso

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

// SQLPool implements the Pool interface using database/sql.
type SQLPool struct {
	db *sql.DB
}

// NewSQLPool creates a new SQLPool with the given DSN.
func NewSQLPool(dsn string, maxOpenConns, maxIdleConns int, connMaxLifetimeSec int) (*SQLPool, error) {
	db, err := sql.Open("libsql", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	db.SetMaxOpenConns(maxOpenConns)
	db.SetMaxIdleConns(maxIdleConns)
	db.SetConnMaxLifetime(time.Duration(connMaxLifetimeSec) * time.Second)

	// Verify connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		db.Close()
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return &SQLPool{db: db}, nil
}

func (p *SQLPool) Conn(ctx context.Context) (Conn, error) {
	return &SQLConn{db: p.db}, nil
}

func (p *SQLPool) Close() error {
	return p.db.Close()
}

func (p *SQLPool) Ping(ctx context.Context) error {
	return p.db.PingContext(ctx)
}

// SQLConn implements the Conn interface using database/sql.
type SQLConn struct {
	db *sql.DB
}

func (c *SQLConn) ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error) {
	return c.db.ExecContext(ctx, query, args...)
}

func (c *SQLConn) QueryContext(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error) {
	return c.db.QueryContext(ctx, query, args...)
}

func (c *SQLConn) QueryRowContext(ctx context.Context, query string, args ...interface{}) *sql.Row {
	return c.db.QueryRowContext(ctx, query, args...)
}

func (c *SQLConn) BeginTx(ctx context.Context, opts *sql.TxOptions) (Tx, error) {
	return c.db.BeginTx(ctx, opts)
}

func (c *SQLConn) Close() error {
	// Connection is managed by the pool, not closed individually
	return nil
}
