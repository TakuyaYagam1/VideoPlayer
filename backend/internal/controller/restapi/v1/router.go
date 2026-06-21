package v1

import (
	"context"
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"

	restmiddleware "github.com/TakuyaYagam1/VideoPlayer/backend/internal/controller/restapi/middleware"
	"github.com/TakuyaYagam1/VideoPlayer/backend/internal/domain"
)

type VideoUseCase interface {
	List(ctx context.Context) ([]domain.Video, error)
	Get(ctx context.Context, id uuid.UUID) (domain.Video, error)
}

type ViewUseCase interface {
	Record(ctx context.Context, videoID uuid.UUID, viewSessionID string) (domain.ViewResult, error)
}

type Handler struct {
	video VideoUseCase
	view  ViewUseCase
	log   *slog.Logger
}

func NewRouter(video VideoUseCase, view ViewUseCase, log *slog.Logger) http.Handler {
	handler := &Handler{video: video, view: view, log: log}

	router := chi.NewRouter()
	router.Get("/videos", handler.listVideos)
	router.Get("/videos/{id}", handler.getVideo)
	router.Post("/videos/{id}/views", handler.recordView)

	return router
}

type videoResponse struct {
	ID      string `json:"id"`
	Title   string `json:"title"`
	M3U8URL string `json:"m3u8_url"`
	Views   int64  `json:"views"`
}

type viewRequest struct {
	ViewSessionID string `json:"view_session_id"`
}

type viewResponse struct {
	VideoID string `json:"video_id"`
	Views   int64  `json:"views"`
	Counted bool   `json:"counted"`
}

type errorResponse struct {
	Error apiError `json:"error"`
}

type apiError struct {
	Code      string `json:"code"`
	Message   string `json:"message"`
	RequestID string `json:"request_id"`
}

func parseVideoID(r *http.Request) (uuid.UUID, bool) {
	videoID, err := uuid.Parse(chi.URLParam(r, "id"))
	return videoID, err == nil
}

func toVideoResponse(video domain.Video) videoResponse {
	return videoResponse{
		ID:      video.ID.String(),
		Title:   video.Title,
		M3U8URL: video.M3U8URL,
		Views:   video.Views,
	}
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func writeError(w http.ResponseWriter, r *http.Request, status int, code string, err error) {
	writeJSON(w, status, errorResponse{
		Error: apiError{
			Code:      code,
			Message:   err.Error(),
			RequestID: restmiddleware.RequestIDFromContext(r.Context()),
		},
	})
}

func (h *Handler) handleError(w http.ResponseWriter, r *http.Request, err error) {
	switch {
	case errors.Is(err, domain.ErrVideoNotFound):
		writeError(w, r, http.StatusNotFound, "video_not_found", domain.ErrVideoNotFound)
	case errors.Is(err, domain.ErrInvalidViewSession):
		writeError(w, r, http.StatusBadRequest, "invalid_view_session_id", domain.ErrInvalidViewSession)
	default:
		h.log.ErrorContext(r.Context(), "api request failed", "error", err)
		writeError(w, r, http.StatusInternalServerError, "internal_error", errors.New("internal server error"))
	}
}
