package logger

import (
	"context"

	"go.uber.org/zap"
)

type contextKey string

const loggerKey contextKey = "logger"

var global *zap.Logger

// Init initializes the global logger with the given level.
func Init(level string) error {
	var cfg zap.Config
	if level == "debug" {
		cfg = zap.NewDevelopmentConfig()
	} else {
		cfg = zap.NewProductionConfig()
	}

	var err error
	global, err = cfg.Build()
	if err != nil {
		return err
	}

	return nil
}

// Global returns the global logger instance.
func Global() *zap.Logger {
	if global == nil {
		global, _ = zap.NewProduction()
	}
	return global
}

// WithContext returns the logger from the context, or the global logger.
func WithContext(ctx context.Context) *zap.Logger {
	if l, ok := ctx.Value(loggerKey).(*zap.Logger); ok {
		return l
	}
	return Global()
}

// FromContext is an alias for WithContext.
func FromContext(ctx context.Context) *zap.Logger {
	return WithContext(ctx)
}

// ToContext stores the logger in the context.
func ToContext(ctx context.Context, l *zap.Logger) context.Context {
	return context.WithValue(ctx, loggerKey, l)
}

// With adds fields to the global logger.
func With(fields ...zap.Field) *zap.Logger {
	return Global().With(fields...)
}

// Debug logs a debug message.
func Debug(msg string, fields ...zap.Field) {
	Global().Debug(msg, fields...)
}

// Info logs an info message.
func Info(msg string, fields ...zap.Field) {
	Global().Info(msg, fields...)
}

// Warn logs a warning message.
func Warn(msg string, fields ...zap.Field) {
	Global().Warn(msg, fields...)
}

// Error logs an error message.
func Error(msg string, fields ...zap.Field) {
	Global().Error(msg, fields...)
}

// Fatal logs a fatal message and exits.
func Fatal(msg string, fields ...zap.Field) {
	Global().Fatal(msg, fields...)
}

// Sync flushes any buffered log entries.
func Sync() error {
	return Global().Sync()
}
