package local

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
)

// Storage is a local file storage implementation.
type Storage struct {
	basePath string
	baseURL  string
}

// New creates a new local file storage.
func New(basePath, baseURL string) (*Storage, error) {
	// Create base directory if it doesn't exist
	if err := os.MkdirAll(basePath, 0755); err != nil {
		return nil, fmt.Errorf("failed to create storage directory: %w", err)
	}

	return &Storage{
		basePath: basePath,
		baseURL:  baseURL,
	}, nil
}

// Upload stores a file locally.
func (s *Storage) Upload(key string, reader io.Reader, contentType string) (string, error) {
	path := filepath.Join(s.basePath, key)

	// Create directory if it doesn't exist
	dir := filepath.Dir(path)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return "", fmt.Errorf("failed to create directory: %w", err)
	}

	file, err := os.Create(path)
	if err != nil {
		return "", fmt.Errorf("failed to create file: %w", err)
	}
	defer file.Close()

	if _, err := io.Copy(file, reader); err != nil {
		return "", fmt.Errorf("failed to write file: %w", err)
	}

	return fmt.Sprintf("%s/%s", s.baseURL, key), nil
}

// Download retrieves a file from local storage.
func (s *Storage) Download(key string) (io.ReadCloser, error) {
	path := filepath.Join(s.basePath, key)
	return os.Open(path)
}

// Delete removes a file from local storage.
func (s *Storage) Delete(key string) error {
	path := filepath.Join(s.basePath, key)
	return os.Remove(path)
}

// GetURL returns the public URL for a file.
func (s *Storage) GetURL(key string) string {
	return fmt.Sprintf("%s/%s", s.baseURL, key)
}
