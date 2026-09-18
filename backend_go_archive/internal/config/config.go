package config

import (
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Port               string
	DBDriver           string
	DBHost             string
	DBPort             string
	DBUser             string
	DBPassword         string
	DBName             string
	DBSSLMode          string
	DBSqlitePath       string
	JWTSecret          string
	JWTExpiryHours     int
	CORSAllowedOrigins []string
	AdminEmail         string
	AdminPassword      string
	AdminName          string
}

func LoadConfig() *Config {
	// Attempt to load .env file, ignore if not present
	_ = godotenv.Load()

	port := getEnv("PORT", "8080")
	dbHost := os.Getenv("DB_HOST")
	dbDriver := os.Getenv("DB_DRIVER")

	// If no DB_DRIVER specified, choose postgres if DB_HOST is present, else fallback to sqlite
	if dbDriver == "" {
		if dbHost != "" {
			dbDriver = "postgres"
		} else {
			dbDriver = "sqlite"
		}
	}

	jwtExpiryHours, err := strconv.Atoi(getEnv("JWT_EXPIRY_HOURS", "24"))
	if err != nil {
		jwtExpiryHours = 24
	}

	originsRaw := getEnv("CORS_ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
	var origins []string
	for _, o := range strings.Split(originsRaw, ",") {
		trimmed := strings.TrimSpace(o)
		if trimmed != "" {
			origins = append(origins, trimmed)
		}
	}

	return &Config{
		Port:               port,
		DBDriver:           dbDriver,
		DBHost:             getEnv("DB_HOST", "localhost"),
		DBPort:             getEnv("DB_PORT", "5432"),
		DBUser:             getEnv("DB_USER", "portfolio"),
		DBPassword:         getEnv("DB_PASSWORD", "secret"),
		DBName:             getEnv("DB_NAME", "portfolio_dev"),
		DBSSLMode:          getEnv("DB_SSLMODE", "disable"),
		DBSqlitePath:       getEnv("DB_SQLITE_PATH", "portfolio.db"),
		JWTSecret:          getEnv("JWT_SECRET", "super-secret-key-change-in-prod-1234567890"),
		JWTExpiryHours:     jwtExpiryHours,
		CORSAllowedOrigins: origins,
		AdminEmail:         getEnv("ADMIN_EMAIL", "admin@portfolio.dev"),
		AdminPassword:      getEnv("ADMIN_PASSWORD", "Admin@123456"),
		AdminName:          getEnv("ADMIN_NAME", "Portfolio Admin"),
	}
}

func getEnv(key, fallback string) string {
	val := os.Getenv(key)
	if val == "" {
		return fallback
	}
	return val
}
