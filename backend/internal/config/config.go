package config

import (
	"fmt"
	"os"
	"time"
)

type Config struct {
	AppName         string
	AppEnv          string
	HTTPAddr        string
	DatabaseURL     string
	ShutdownTimeout time.Duration
}

func Load() (Config, error) {
	cfg := Config{
		AppName:         getenv("APP_NAME", "ifbest-video-player"),
		AppEnv:          getenv("APP_ENV", "local"),
		HTTPAddr:        getenv("HTTP_ADDR", ":8080"),
		DatabaseURL:     getenv("DATABASE_URL", "postgres://ifbest:ifbest@localhost:5432/ifbest_video_player?sslmode=disable"),
		ShutdownTimeout: 10 * time.Second,
	}

	if raw := os.Getenv("SHUTDOWN_TIMEOUT"); raw != "" {
		timeout, err := time.ParseDuration(raw)
		if err != nil {
			return Config{}, fmt.Errorf("parse SHUTDOWN_TIMEOUT: %w", err)
		}
		cfg.ShutdownTimeout = timeout
	}

	return cfg, nil
}

func getenv(key, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	return value
}
