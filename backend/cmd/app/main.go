package main

import (
	"context"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	application "github.com/TakuyaYagam1/VideoPlayer/backend/internal/app"
	"github.com/TakuyaYagam1/VideoPlayer/backend/internal/config"
	"github.com/TakuyaYagam1/VideoPlayer/backend/pkg/logger"
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

	app, err := application.New(ctx, cfg, log)
	if err != nil {
		log.Error("initialize app", "error", err)
		os.Exit(1)
	}

	if err := app.Run(ctx); err != nil {
		log.Error("run app", "error", err)
		os.Exit(1)
	}
}
