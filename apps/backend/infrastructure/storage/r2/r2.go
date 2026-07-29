package r2

import (
	"fmt"
	"io"

	"github.com/contigo/backend/configs"
)

// Storage is a Cloudflare R2 storage implementation.
// Uses S3-compatible API.
type Storage struct {
	config configs.R2Config
}

// New creates a new R2 storage.
func New(config configs.R2Config) (*Storage, error) {
	if config.AccountID == "" || config.AccessKey == "" || config.SecretKey == "" {
		return nil, fmt.Errorf("R2 storage requires account_id, access_key, and secret_key")
	}

	return &Storage{
		config: config,
	}, nil
}

// Upload stores a file in R2.
func (s *Storage) Upload(key string, reader io.Reader, contentType string) (string, error) {
	// TODO: Implement S3-compatible upload using aws-sdk-go
	// This is a placeholder for the R2 adapter
	return fmt.Sprintf("%s/%s", s.config.PublicURL, key), nil
}

// Download retrieves a file from R2.
func (s *Storage) Download(key string) (io.ReadCloser, error) {
	// TODO: Implement S3-compatible download
	return nil, fmt.Errorf("not implemented")
}

// Delete removes a file from R2.
func (s *Storage) Delete(key string) error {
	// TODO: Implement S3-compatible delete
	return fmt.Errorf("not implemented")
}

// GetURL returns the public URL for a file.
func (s *Storage) GetURL(key string) string {
	return fmt.Sprintf("%s/%s", s.config.PublicURL, key)
}
