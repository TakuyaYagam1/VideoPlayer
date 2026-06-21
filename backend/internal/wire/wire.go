package wire

import (
	"log/slog"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"

	v1 "github.com/TakuyaYagam1/VideoPlayer/backend/internal/controller/restapi/v1"
	postgresrepo "github.com/TakuyaYagam1/VideoPlayer/backend/internal/repo/postgres"
	videousecase "github.com/TakuyaYagam1/VideoPlayer/backend/internal/usecase/video"
	viewusecase "github.com/TakuyaYagam1/VideoPlayer/backend/internal/usecase/view"
)

func NewV1Router(pool *pgxpool.Pool, log *slog.Logger) http.Handler {
	videoRepo := postgresrepo.NewVideoRepository(pool)
	viewRepo := postgresrepo.NewViewRepository(pool)
	videoService := videousecase.New(videoRepo)
	viewService := viewusecase.New(viewRepo)

	return v1.NewRouter(videoService, viewService, log)
}
