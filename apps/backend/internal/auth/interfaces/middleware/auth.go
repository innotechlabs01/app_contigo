package middleware

import (
	"github.com/contigo/backend/infrastructure/auth/clerk"
	"github.com/contigo/backend/pkg/response"

	"github.com/gofiber/fiber/v3"
)

// AuthMiddleware creates a Clerk JWT verification middleware.
func AuthMiddleware(verifier clerk.Verifier) fiber.Handler {
	return func(c fiber.Ctx) error {
		token := c.Get("Authorization")
		if token == "" {
			return response.Unauthorized(c, "Missing authorization header")
		}

		// Remove "Bearer " prefix
		if len(token) > 7 && token[:7] == "Bearer " {
			token = token[7:]
		}

		claims, err := verifier.Verify(token)
		if err != nil {
			return response.Unauthorized(c, "Invalid or expired token")
		}

		// Set user context values
		c.Locals("user_id", claims.UserID)
		c.Locals("org_id", claims.OrgID)
		c.Locals("roles", claims.Roles)

		return c.Next()
	}
}

// RequireAuth creates a middleware that requires authentication.
// This is a convenience wrapper around AuthMiddleware.
func RequireAuth(verifier clerk.Verifier) fiber.Handler {
	return AuthMiddleware(verifier)
}
