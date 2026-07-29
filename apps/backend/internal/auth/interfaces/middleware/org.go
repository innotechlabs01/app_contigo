package middleware

import (
	"github.com/contigo/backend/pkg/response"

	"github.com/gofiber/fiber/v3"
)

// OrgContext extracts organization context from the authenticated user.
func OrgContext() fiber.Handler {
	return func(c fiber.Ctx) error {
		orgID, ok := c.Locals("org_id").(string)
		if !ok || orgID == "" {
			return response.Forbidden(c, "Organization context required")
		}

		c.Locals("org_id", orgID)
		return c.Next()
	}
}

// RequireOrg ensures the request has an organization context.
func RequireOrg() fiber.Handler {
	return OrgContext()
}

// RequireRole checks if the user has a specific role.
func RequireRole(role string) fiber.Handler {
	return func(c fiber.Ctx) error {
		roles, ok := c.Locals("roles").([]string)
		if !ok {
			return response.Forbidden(c, "No roles assigned")
		}

		for _, r := range roles {
			if r == role {
				return c.Next()
			}
		}

		return response.Forbidden(c, "Insufficient permissions")
	}
}

// RequirePermission checks if the user has a specific permission.
func RequirePermission(permission string) fiber.Handler {
	return func(c fiber.Ctx) error {
		// Permission checking will be implemented with the roles/permissions module
		// For now, this is a placeholder
		permissions, ok := c.Locals("permissions").([]string)
		if !ok {
			return response.Forbidden(c, "No permissions assigned")
		}

		for _, p := range permissions {
			if p == permission {
				return c.Next()
			}
		}

		return response.Forbidden(c, "Insufficient permissions")
	}
}
