package utils

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"strconv"
	"strings"
)

// GenerateID generates a random hex-encoded ID of the given byte length.
func GenerateID(byteLength int) (string, error) {
	b := make([]byte, byteLength)
	if _, err := rand.Read(b); err != nil {
		return "", fmt.Errorf("failed to generate ID: %w", err)
	}
	return hex.EncodeToString(b), nil
}

// MustGenerateID generates a random ID or panics.
func MustGenerateID(byteLength int) string {
	id, err := GenerateID(byteLength)
	if err != nil {
		panic(err)
	}
	return id
}

// Ptr returns a pointer to the given value.
func Ptr[T any](v T) *T {
	return &v
}

// Deref returns the value of the pointer or the zero value.
func Deref[T any](p *T, defaultVal T) T {
	if p == nil {
		return defaultVal
	}
	return *p
}

// Contains checks if a slice contains a value.
func Contains[T comparable](slice []T, val T) bool {
	for _, v := range slice {
		if v == val {
			return true
		}
	}
	return false
}

// Filter returns a new slice containing only elements that satisfy the predicate.
func Filter[T any](slice []T, predicate func(T) bool) []T {
	var result []T
	for _, v := range slice {
		if predicate(v) {
			result = append(result, v)
		}
	}
	return result
}

// Map transforms a slice by applying a function to each element.
func Map[T any, R any](slice []T, fn func(T) R) []R {
	result := make([]R, len(slice))
	for i, v := range slice {
		result[i] = fn(v)
	}
	return result
}

// SplitAndTrim splits a string by delimiter and trims whitespace from each part.
func SplitAndTrim(s string, delim string) []string {
	parts := strings.Split(s, delim)
	result := make([]string, 0, len(parts))
	for _, p := range parts {
		trimmed := strings.TrimSpace(p)
		if trimmed != "" {
			result = append(result, trimmed)
		}
	}
	return result
}

// Atoi is a safe string-to-int conversion.
func Atoi(s string) (int, error) {
	return strconv.Atoi(s)
}

// Itoa is a safe int-to-string conversion.
func Itoa(i int) string {
	return strconv.Itoa(i)
}
