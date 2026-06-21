package main

import (
	"context"
	"database/sql"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/pressly/goose/v3"

	"github.com/TakuyaYagam1/VideoPlayer/backend/internal/config"
	"github.com/TakuyaYagam1/VideoPlayer/backend/pkg/logger"

	_ "github.com/jackc/pgx/v5/stdlib"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		slog.Error("load config", "error", err)
		os.Exit(1)
	}

	log := logger.New(cfg.AppEnv)
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	db, err := sql.Open("pgx", cfg.DatabaseURL)
	if err != nil {
		log.Error("open database", "error", err)
		os.Exit(1)
	}
	defer func() {
		if err := db.Close(); err != nil {
			log.Error("close database", "error", err)
		}
	}()

	if err := db.PingContext(ctx); err != nil {
		log.Error("ping database", "error", err)
		os.Exit(1)
	}

	if err := goose.SetDialect("postgres"); err != nil {
		log.Error("set goose dialect", "error", err)
		os.Exit(1)
	}

	direction := "up"
	if len(os.Args) > 1 {
		direction = os.Args[1]
	}

	var migrateErr error
	switch direction {
	case "up":
		migrateErr = goose.UpContext(ctx, db, "db/migrations")
	case "down":
		migrateErr = goose.DownContext(ctx, db, "db/migrations")
	default:
		log.Error("unsupported migration direction", "direction", direction)
		os.Exit(1)
	}

	if migrateErr != nil {
		log.Error("apply migrations", "error", migrateErr)
		os.Exit(1)
	}

	log.Info("migrations applied", "direction", direction)
}
