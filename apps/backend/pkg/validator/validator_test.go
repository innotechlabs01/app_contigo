package validator

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

type TestStruct struct {
	Name  string `validate:"required"`
	Email string `validate:"required,email"`
	Age   int    `validate:"gte=0,lte=130"`
}

func TestValidate_Success(t *testing.T) {
	Init()

	s := TestStruct{
		Name:  "John",
		Email: "john@example.com",
		Age:   30,
	}

	err := Validate(s)
	assert.Nil(t, err)
}

func TestValidate_RequiredField(t *testing.T) {
	Init()

	s := TestStruct{
		Name:  "",
		Email: "john@example.com",
		Age:   30,
	}

	err := Validate(s)
	assert.NotNil(t, err)
	assert.Equal(t, "VALIDATION_ERROR", err.Code)
}

func TestValidate_InvalidEmail(t *testing.T) {
	Init()

	s := TestStruct{
		Name:  "John",
		Email: "not-an-email",
		Age:   30,
	}

	err := Validate(s)
	assert.NotNil(t, err)
	assert.Equal(t, "VALIDATION_ERROR", err.Code)
}
