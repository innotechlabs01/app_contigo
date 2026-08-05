package errors

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestAppError_Error(t *testing.T) {
	tests := []struct {
		name     string
		err      *AppError
		expected string
	}{
		{
			name:     "error without wrapped error",
			err:      New(ErrCodeNotFound, "User not found"),
			expected: "NOT_FOUND: User not found",
		},
		{
			name:     "error with wrapped error",
			err:      Wrap(assert.AnError, ErrCodeInternal, "Database connection failed"),
			expected: "INTERNAL_ERROR: Database connection failed: " + assert.AnError.Error(),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.expected, tt.err.Error())
		})
	}
}

func TestAppError_Unwrap(t *testing.T) {
	inner := assert.AnError
	err := Wrap(inner, ErrCodeInternal, "wrapped")

	assert.Equal(t, inner, err.Unwrap())
}

func TestIs(t *testing.T) {
	err := New(ErrCodeNotFound, "not found")
	target := ErrNotFound

	assert.True(t, Is(err, target))
	assert.False(t, Is(err, ErrInternal))
}

func TestCode(t *testing.T) {
	err := New(ErrCodeConflict, "conflict")
	assert.Equal(t, ErrCodeConflict, Code(err))

	assert.Equal(t, ErrCodeInternal, Code(assert.AnError))
}

func TestStatusCode(t *testing.T) {
	tests := []struct {
		code     string
		expected int
	}{
		{ErrCodeNotFound, 404},
		{ErrCodeUnauthorized, 401},
		{ErrCodeForbidden, 403},
		{ErrCodeValidation, 400},
		{ErrCodeConflict, 409},
		{ErrCodeRateLimited, 429},
		{ErrCodeBadRequest, 400},
		{ErrCodeInternal, 500},
		{"UNKNOWN", 500},
	}

	for _, tt := range tests {
		t.Run(tt.code, func(t *testing.T) {
			assert.Equal(t, tt.expected, StatusCode(tt.code))
		})
	}
}
