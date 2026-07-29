package validator

import (
	"fmt"
	"strings"

	"github.com/go-playground/validator/v10"

	apperr "github.com/contigo/backend/pkg/errors"
)

var validate *validator.Validate

// Init initializes the validator.
func Init() {
	validate = validator.New()
}

// Validate validates a struct and returns an AppError if validation fails.
func Validate(s interface{}) *apperr.AppError {
	if validate == nil {
		Init()
	}

	if err := validate.Struct(s); err != nil {
		var errs []string
		for _, e := range err.(validator.ValidationErrors) {
			errs = append(errs, fmt.Sprintf("%s: %s", e.Field(), e.Tag()))
		}
		return apperr.New(
			apperr.ErrCodeValidation,
			strings.Join(errs, "; "),
		)
	}
	return nil
}

// RegisterValidation registers a custom validation function.
func RegisterValidation(tag string, fn validator.Func) error {
	if validate == nil {
		Init()
	}
	return validate.RegisterValidation(tag, fn)
}
