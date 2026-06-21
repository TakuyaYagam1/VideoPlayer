package app

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/sync/errgroup"

	"github.com/TakuyaYagam1/VideoPlayer/backend/internal/config"
	restmiddleware "github.com/TakuyaYagam1/VideoPlayer/backend/internal/controller/restapi/middleware"
	"github.com/TakuyaYagam1/VideoPlayer/backend/internal/wire"
	pg "github.com/TakuyaYagam1/VideoPlayer/backend/pkg/postgres"
	httpserver "github.com/TakuyaYagam1/VideoPlayer/backend/pkg/server"
)

type App struct {
	cfg    config.Config
	log    *slog.Logger
	pool   *pgxpool.Pool
	server *http.Server
}

func New(ctx context.Context, cfg config.Config, log *slog.Logger) (*App, error) {
	pool, err := pg.NewPool(ctx, cfg.DatabaseURL)
	if err != nil {
		return nil, err
	}

	router := chi.NewRouter()
	router.Use(restmiddleware.RequestID)
	router.Use(restmiddleware.Recoverer(log))
	router.Use(restmiddleware.AccessLog(log))
	router.Get("/healthz", health)
	router.Get("/readyz", readiness(pool))
	router.Mount("/api/v1", wire.NewV1Router(pool, log))

	server := httpserver.New(httpserver.Config{Addr: cfg.HTTPAddr}, router)

	return &App{
		cfg:    cfg,
		log:    log,
		pool:   pool,
		server: server,
	}, nil
}

func (a *App) Run(ctx context.Context) error {
	group, ctx := errgroup.WithContext(ctx)

	group.Go(func() error {
		a.log.Info("starting http server", "addr", a.cfg.HTTPAddr)
		if err := a.server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			return fmt.Errorf("http server: %w", err)
		}
		return nil
	})

	group.Go(func() error {
		<-ctx.Done()

		shutdownCtx, cancel := context.WithTimeout(context.Background(), a.cfg.ShutdownTimeout)
		defer cancel()

		a.log.Info("shutting down http server")
		if err := a.server.Shutdown(shutdownCtx); err != nil {
			return fmt.Errorf("shutdown http server: %w", err)
		}
		a.pool.Close()

		return nil
	})

	return group.Wait()
}

func health(w http.ResponseWriter, _ *http.Request) {
	writeStatus(w, http.StatusOK, "ok")
}

func readiness(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(r.Context(), time.Second)
		defer cancel()

		if err := pool.Ping(ctx); err != nil {
			writeStatus(w, http.StatusServiceUnavailable, "not ready")
			return
		}

		writeStatus(w, http.StatusOK, "ready")
	}
}

func writeStatus(w http.ResponseWriter, status int, body string) {
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.WriteHeader(status)
	_, _ = w.Write([]byte(body))
}
