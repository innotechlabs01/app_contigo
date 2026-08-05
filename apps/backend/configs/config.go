package configs

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/spf13/viper"
)

func loadDotEnv(files ...string) {
	for _, file := range files {
		f, err := os.Open(file)
		if err != nil {
			continue
		}
		defer f.Close()
		scanner := bufio.NewScanner(f)
		for scanner.Scan() {
			line := strings.TrimSpace(scanner.Text())
			if line == "" || strings.HasPrefix(line, "#") {
				continue
			}
			if parts := strings.SplitN(line, "=", 2); len(parts) == 2 {
				key := strings.TrimSpace(parts[0])
				val := strings.TrimSpace(parts[1])
				if key != "" && val != "" {
					if _, exists := os.LookupEnv(key); !exists {
						os.Setenv(key, val)
					}
				}
			}
		}
	}
}

// Config holds all configuration for the application.
type Config struct {
	Server   ServerConfig   `mapstructure:"server"`
	Database DatabaseConfig `mapstructure:"database"`
	Auth     AuthConfig     `mapstructure:"auth"`
	Storage  StorageConfig  `mapstructure:"storage"`
	Cache    CacheConfig    `mapstructure:"cache"`
	Log      LogConfig      `mapstructure:"log"`
}

// ServerConfig holds HTTP server configuration.
type ServerConfig struct {
	Host         string `mapstructure:"host"`
	Port         int    `mapstructure:"port"`
	ReadTimeout  int    `mapstructure:"read_timeout"`
	WriteTimeout int    `mapstructure:"write_timeout"`
}

// DatabaseConfig holds database configuration.
type DatabaseConfig struct {
	URL             string `mapstructure:"url"`
	MaxOpenConns    int    `mapstructure:"max_open_conns"`
	MaxIdleConns    int    `mapstructure:"max_idle_conns"`
	ConnMaxLifetime int    `mapstructure:"conn_max_lifetime"`
}

// AuthConfig holds authentication configuration.
type AuthConfig struct {
	ClerkJWKSURL string `mapstructure:"clerk_jwks_url"`
	ClerkIssuer  string `mapstructure:"clerk_issuer"`
}

// StorageConfig holds file storage configuration.
type StorageConfig struct {
	Provider string     `mapstructure:"provider"`
	R2       R2Config   `mapstructure:"r2"`
	Local    LocalConfig `mapstructure:"local"`
}

// R2Config holds Cloudflare R2 configuration.
type R2Config struct {
	AccountID  string `mapstructure:"account_id"`
	AccessKey  string `mapstructure:"access_key"`
	SecretKey  string `mapstructure:"secret_key"`
	BucketName string `mapstructure:"bucket_name"`
	PublicURL  string `mapstructure:"public_url"`
}

// LocalConfig holds local file storage configuration.
type LocalConfig struct {
	BasePath string `mapstructure:"base_path"`
	BaseURL  string `mapstructure:"base_url"`
}

// CacheConfig holds cache configuration.
type CacheConfig struct {
	Provider string `mapstructure:"provider"`
}

// LogConfig holds logging configuration.
type LogConfig struct {
	Level  string `mapstructure:"level"`
	Format string `mapstructure:"format"`
}

// Load loads configuration from file and environment variables.
func Load() (*Config, error) {
	// Load .env files into OS environment variables
	loadDotEnv(".env", "./configs/.env")

	v := viper.New()

	// Set defaults
	setDefaults(v)

	// Read environment variables (Viper automatic binding)
	v.AutomaticEnv()

	// Override with explicit environment variable mapping
	loadFromEnv(v)

	var cfg Config
	if err := v.Unmarshal(&cfg); err != nil {
		return nil, fmt.Errorf("failed to unmarshal config: %w", err)
	}

	return &cfg, nil
}

// setDefaults sets default values for all configuration options.
func setDefaults(v *viper.Viper) {
	// Server
	v.SetDefault("server.host", "0.0.0.0")
	v.SetDefault("server.port", 8080)
	v.SetDefault("server.read_timeout", 30)
	v.SetDefault("server.write_timeout", 30)

	// Database
	v.SetDefault("database.url", "libsql://localhost:8080")
	v.SetDefault("database.max_open_conns", 25)
	v.SetDefault("database.max_idle_conns", 5)
	v.SetDefault("database.conn_max_lifetime", 300)

	// Auth
	v.SetDefault("auth.clerk_jwks_url", "")
	v.SetDefault("auth.clerk_issuer", "")

	// Storage
	v.SetDefault("storage.provider", "local")
	v.SetDefault("storage.r2.account_id", "")
	v.SetDefault("storage.r2.access_key", "")
	v.SetDefault("storage.r2.secret_key", "")
	v.SetDefault("storage.r2.bucket_name", "")
	v.SetDefault("storage.r2.public_url", "")
	v.SetDefault("storage.local.base_path", "./uploads")
	v.SetDefault("storage.local.base_url", "http://localhost:8080/uploads")

	// Cache
	v.SetDefault("cache.provider", "memory")

	// Log
	v.SetDefault("log.level", "info")
	v.SetDefault("log.format", "json")
}

// loadFromEnv overrides config values with environment variables.
func loadFromEnv(v *viper.Viper) {
	envMap := map[string]string{
		"SERVER_HOST":              "server.host",
		"SERVER_PORT":              "server.port",
		"DATABASE_URL":             "database.url",
		"DATABASE_MAX_OPEN_CONNS":  "database.max_open_conns",
		"DATABASE_MAX_IDLE_CONNS":  "database.max_idle_conns",
		"DATABASE_CONN_MAX_LIFETIME": "database.conn_max_lifetime",
		"CLERK_JWKS_URL":           "auth.clerk_jwks_url",
		"CLERK_ISSUER":             "auth.clerk_issuer",
		"STORAGE_PROVIDER":         "storage.provider",
		"R2_ACCOUNT_ID":            "storage.r2.account_id",
		"R2_ACCESS_KEY":            "storage.r2.access_key",
		"R2_SECRET_KEY":            "storage.r2.secret_key",
		"R2_BUCKET_NAME":           "storage.r2.bucket_name",
		"R2_PUBLIC_URL":            "storage.r2.public_url",
		"LOCAL_STORAGE_PATH":       "storage.local.base_path",
		"LOCAL_STORAGE_URL":        "storage.local.base_url",
		"CACHE_PROVIDER":           "cache.provider",
		"LOG_LEVEL":                "log.level",
		"LOG_FORMAT":               "log.format",
	}

	for envKey, viperKey := range envMap {
		if val := os.Getenv(envKey); val != "" {
			v.Set(viperKey, val)
		}
	}
}

// GetServerAddress returns the server address in host:port format.
func (c *Config) GetServerAddress() string {
	return fmt.Sprintf("%s:%d", c.Server.Host, c.Server.Port)
}

// IsProduction returns true if the environment is production.
func (c *Config) IsProduction() bool {
	return os.Getenv("APP_ENV") == "production"
}

// GetIntEnv returns an integer environment variable or a default value.
func GetIntEnv(key string, defaultVal int) int {
	val := os.Getenv(key)
	if val == "" {
		return defaultVal
	}
	i, err := strconv.Atoi(val)
	if err != nil {
		return defaultVal
	}
	return i
}
