package main

import (
	"context"
	"errors"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/contigo/backend/configs"
	"github.com/contigo/backend/infrastructure/auth/clerk"
	"github.com/contigo/backend/infrastructure/cache/memory"
	"github.com/contigo/backend/infrastructure/database/turso"
	fibermw "github.com/contigo/backend/interfaces/middleware"
	"github.com/contigo/backend/internal/auth/interfaces/middleware"
	healthhandler "github.com/contigo/backend/internal/health/interfaces/http/handler"
	healthroute "github.com/contigo/backend/internal/health/interfaces/http/route"
	"github.com/contigo/backend/internal/requests/application/usecase"
	requestrepo "github.com/contigo/backend/internal/requests/data/repository"
	"github.com/contigo/backend/internal/requests/interfaces/http/handler"
	requestroute "github.com/contigo/backend/internal/requests/interfaces/http/route"
	userusecase "github.com/contigo/backend/internal/users/application/usecase"
	userrepo "github.com/contigo/backend/internal/users/data/repository"
	userhandler "github.com/contigo/backend/internal/users/interfaces/http/handler"
	userroute "github.com/contigo/backend/internal/users/interfaces/http/route"
	apperr "github.com/contigo/backend/pkg/errors"
	"github.com/contigo/backend/pkg/logger"
	"github.com/contigo/backend/pkg/response"
	"github.com/contigo/backend/pkg/validator"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/limiter"
	"github.com/gofiber/fiber/v3/middleware/recover"
	"github.com/gofiber/fiber/v3/middleware/requestid"
	"go.uber.org/zap"
)

func main() {
	// Load configuration
	cfg, err := configs.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize logger
	if err := logger.Init(cfg.Log.Level); err != nil {
		log.Fatalf("Failed to initialize logger: %v", err)
	}
	defer logger.Sync()

	logger.Info("Starting Contigo backend",
		zap.String("host", cfg.Server.Host),
		zap.Int("port", cfg.Server.Port),
	)

	// Initialize validator
	validator.Init()

	// Initialize database
	pool, err := turso.NewSQLPool(
		cfg.Database.URL,
		cfg.Database.MaxOpenConns,
		cfg.Database.MaxIdleConns,
		cfg.Database.ConnMaxLifetime,
	)
	if err != nil {
		logger.Fatal("Failed to connect to database", zap.Error(err))
	}
	defer pool.Close()

	// Run migrations
	ctx := context.Background()
	migrator := turso.NewMigrator(pool)
	if err := migrator.Up(ctx, "./infrastructure/database/migration/migrations"); err != nil {
		logger.Warn("Migration warning", zap.Error(err))
	}

	// Initialize Clerk verifier. Fail-closed: authentication is mandatory for
	// every /api/v1 route, so the server refuses to start without it instead of
	// silently exposing the API unauthenticated.
	if cfg.Auth.ClerkJWKSURL == "" {
		logger.Fatal("CLERK_JWKS_URL is required: refusing to start with authentication disabled")
	}
	verifier := clerk.NewJWKSVerifier(cfg.Auth.ClerkJWKSURL, cfg.Auth.ClerkIssuer)

	// Initialize cache
	_ = memory.New()

	// Initialize Fiber app
	app := fiber.New(fiber.Config{
		AppName:      "Contigo Backend",
		ErrorHandler: customErrorHandler,
		ReadTimeout:  time.Duration(cfg.Server.ReadTimeout) * time.Second,
		WriteTimeout: time.Duration(cfg.Server.WriteTimeout) * time.Second,
	})

	// Global middleware
	app.Use(recover.New())
	app.Use(requestid.New())
	app.Use(fibermw.CORS())
	app.Use(fibermw.Logger())

	// Health endpoints (no auth required)
	healthHandler := healthhandler.NewHealthHandler(pool)
	healthroute.Register(app, healthHandler)

	// API v1 routes
	v1 := app.Group("/api/v1")

	// Apply rate limiting and authentication to all protected routes.
	v1.Use(limiter.New(limiter.Config{
		Max:        configs.GetIntEnv("RATE_LIMIT_MAX", 120),
		Expiration: time.Minute,
		KeyGenerator: func(c fiber.Ctx) string {
			return c.IP()
		},
		// Route the 429 through the error handler so it returns the
		// structured {"code":"RATE_LIMITED"} envelope.
		LimitReached: func(c fiber.Ctx) error {
			return fiber.ErrTooManyRequests
		},
	}))
	v1.Use(middleware.AuthMiddleware(verifier))

	// Swagger documentation (placeholder)
	v1.Get("/swagger/*", func(c fiber.Ctx) error {
		return response.Success(c, 200, fiber.Map{
			"message": "Swagger documentation - coming soon",
		})
	})

	// Initialize user service
	usrRepo := userrepo.NewUserRepository(pool)
	usrUC := userusecase.NewUserUseCase(usrRepo)
	usrHandler := userhandler.NewUserHandler(usrUC)
	userroute.Register(v1, usrHandler)

	// Initialize request service
	reqRepo := requestrepo.NewRequestRepository(pool)
	reqUC := usecase.NewRequestUseCase(reqRepo, nil, usrUC, time.Duration(cfg.Requests.ExpiryMinutes)*time.Minute)
	reqHandler := handler.NewRequestHandler(reqUC)
	requestroute.Register(v1, reqHandler, reqUC.Hub)
	reqUC.StartExpirySweeper(ctx, time.Minute)

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		<-quit
		logger.Info("Shutting down server...")
		if err := app.Shutdown(); err != nil {
			logger.Error("Server forced to shutdown", zap.Error(err))
		}
	}()

	// Start server
	addr := cfg.GetServerAddress()
	logger.Info("Server listening", zap.String("address", addr))
	if err := app.Listen(addr); err != nil {
		logger.Fatal("Server failed to start", zap.Error(err))
	}
}

func customErrorHandler(c fiber.Ctx, err error) error {
	// Domain errors carry their own code + HTTP status mapping.
	var appErr *apperr.AppError
	if errors.As(err, &appErr) {
		return response.Error(c, appErr)
	}

	// Fiber built-in errors (e.g. 404, 405, 429 from rate limiting).
	if e, ok := err.(*fiber.Error); ok {
		return response.ErrorWithStatus(c, e.Code, errCodeForStatus(e.Code), e.Message)
	}

	return response.Internal(c, "Internal server error")
}

func errCodeForStatus(status int) string {
	switch status {
	case fiber.StatusNotFound:
		return apperr.ErrCodeNotFound
	case fiber.StatusUnauthorized:
		return apperr.ErrCodeUnauthorized
	case fiber.StatusForbidden:
		return apperr.ErrCodeForbidden
	case fiber.StatusBadRequest:
		return apperr.ErrCodeBadRequest
	case fiber.StatusConflict:
		return apperr.ErrCodeConflict
	case fiber.StatusTooManyRequests:
		return apperr.ErrCodeRateLimited
	default:
		return apperr.ErrCodeInternal
	}
}
