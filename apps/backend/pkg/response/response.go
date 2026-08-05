package response

import (
	"encoding/json"

	apperr "github.com/contigo/backend/pkg/errors"

	"github.com/gofiber/fiber/v3"
)

// Response is the standard API response envelope.
type Response struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   *ErrorBody  `json:"error,omitempty"`
}

// ErrorBody represents the error portion of a response.
type ErrorBody struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

// Success sends a success response with the given status code and data.
func Success(c fiber.Ctx, status int, data interface{}) error {
	return c.Status(status).JSON(Response{
		Success: true,
		Data:    data,
	})
}

// Created sends a 201 Created response.
func Created(c fiber.Ctx, data interface{}) error {
	return Success(c, fiber.StatusCreated, data)
}

// NoContent sends a 204 No Content response.
func NoContent(c fiber.Ctx) error {
	return c.SendStatus(fiber.StatusNoContent)
}

// Error sends an error response.
func Error(c fiber.Ctx, err *apperr.AppError) error {
	status := apperr.StatusCode(err.Code)
	return c.Status(status).JSON(Response{
		Success: false,
		Error: &ErrorBody{
			Code:    err.Code,
			Message: err.Message,
		},
	})
}

// ErrorWithStatus sends an error response with a custom status code.
func ErrorWithStatus(c fiber.Ctx, status int, code string, message string) error {
	return c.Status(status).JSON(Response{
		Success: false,
		Error: &ErrorBody{
			Code:    code,
			Message: message,
		},
	})
}

// BadRequest sends a 400 Bad Request response.
func BadRequest(c fiber.Ctx, message string) error {
	return ErrorWithStatus(c, fiber.StatusBadRequest, apperr.ErrCodeBadRequest, message)
}

// Unauthorized sends a 401 Unauthorized response.
func Unauthorized(c fiber.Ctx, message string) error {
	return ErrorWithStatus(c, fiber.StatusUnauthorized, apperr.ErrCodeUnauthorized, message)
}

// Forbidden sends a 403 Forbidden response.
func Forbidden(c fiber.Ctx, message string) error {
	return ErrorWithStatus(c, fiber.StatusForbidden, apperr.ErrCodeForbidden, message)
}

// NotFound sends a 404 Not Found response.
func NotFound(c fiber.Ctx, message string) error {
	return ErrorWithStatus(c, fiber.StatusNotFound, apperr.ErrCodeNotFound, message)
}

// Conflict sends a 409 Conflict response.
func Conflict(c fiber.Ctx, message string) error {
	return ErrorWithStatus(c, fiber.StatusConflict, apperr.ErrCodeConflict, message)
}

// Internal sends a 500 Internal Server Error response.
func Internal(c fiber.Ctx, message string) error {
	return ErrorWithStatus(c, fiber.StatusInternalServerError, apperr.ErrCodeInternal, message)
}

// ParseBody parses the request body into the given struct.
func ParseBody(c fiber.Ctx, dest interface{}) error {
	if err := c.Bind().Body(dest); err != nil {
		return apperr.Wrap(err, apperr.ErrCodeBadRequest, "Invalid request body")
	}
	return nil
}

// ParseQuery parses query parameters into the given struct.
func ParseQuery(c fiber.Ctx, dest interface{}) error {
	if err := c.Bind().Query(dest); err != nil {
		return apperr.Wrap(err, apperr.ErrCodeBadRequest, "Invalid query parameters")
	}
	return nil
}

// ToJSON converts an object to JSON bytes.
func ToJSON(v interface{}) ([]byte, error) {
	return json.Marshal(v)
}
