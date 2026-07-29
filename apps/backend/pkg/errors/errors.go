package errors

import (
	"errors"
	"fmt"
)

// AppError represents a structured application error.
type AppError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Err     error  `json:"-"`
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %s: %v", e.Code, e.Message, e.Err)
	}
	return fmt.Sprintf("%s: %s", e.Code, e.Message)
}

func (e *AppError) Unwrap() error {
	return e.Err
}

// New creates a new AppError with the given code and message.
func New(code string, message string) *AppError {
	return &AppError{Code: code, Message: message}
}

// Wrap wraps an existing error with a code and message.
func Wrap(err error, code string, message string) *AppError {
	return &AppError{Code: code, Message: message, Err: err}
}

// Wrapf wraps an existing error with a formatted message.
func Wrapf(err error, code string, format string, args ...interface{}) *AppError {
	return &AppError{Code: code, Message: fmt.Sprintf(format, args...), Err: err}
}

// Is checks if the target error has the same code.
func Is(err, target error) bool {
	var targetErr *AppError
	if !errors.As(target, &targetErr) {
		return false
	}
	var appErr *AppError
	if !errors.As(err, &appErr) {
		return false
	}
	return appErr.Code == targetErr.Code
}

// Code extracts the error code from an AppError.
func Code(err error) string {
	var appErr *AppError
	if errors.As(err, &appErr) {
		return appErr.Code
	}
	return ErrCodeInternal
}

// StatusCode maps an error code to an HTTP status code.
func StatusCode(code string) int {
	switch code {
	case ErrCodeNotFound:
		return 404
	case ErrCodeUnauthorized:
		return 401
	case ErrCodeForbidden:
		return 403
	case ErrCodeValidation:
		return 400
	case ErrCodeConflict:
		return 409
	case ErrCodeRateLimited:
		return 429
	case ErrCodeBadRequest:
		return 400
	default:
		return 500
	}
}
