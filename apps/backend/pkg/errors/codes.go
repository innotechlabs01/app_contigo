package errors

// Domain-level error codes.
const (
	ErrCodeNotFound     = "NOT_FOUND"
	ErrCodeUnauthorized = "UNAUTHORIZED"
	ErrCodeForbidden    = "FORBIDDEN"
	ErrCodeValidation   = "VALIDATION_ERROR"
	ErrCodeInternal     = "INTERNAL_ERROR"
	ErrCodeConflict     = "CONFLICT"
	ErrCodeRateLimited  = "RATE_LIMITED"
	ErrCodeBadRequest   = "BAD_REQUEST"
)

// Predefined domain errors.
var (
	ErrNotFound     = New(ErrCodeNotFound, "Resource not found")
	ErrUnauthorized = New(ErrCodeUnauthorized, "Unauthorized")
	ErrForbidden    = New(ErrCodeForbidden, "Forbidden")
	ErrValidation   = New(ErrCodeValidation, "Validation error")
	ErrInternal     = New(ErrCodeInternal, "Internal server error")
	ErrConflict     = New(ErrCodeConflict, "Resource conflict")
	ErrRateLimited  = New(ErrCodeRateLimited, "Rate limited")
	ErrBadRequest   = New(ErrCodeBadRequest, "Bad request")
)
