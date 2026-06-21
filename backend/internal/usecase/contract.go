package usecase

import (
	"context"

	"github.com/google/uuid"

	"github.com/TakuyaYagam1/VideoPlayer/backend/internal/domain"
)

type VideoRepository interface {
	List(ctx context.Context) ([]domain.Video, error)
	Get(ctx context.Context, id uuid.UUID) (domain.Video, error)
}

type ViewRepository interface {
	Record(ctx context.Context, videoID uuid.UUID, viewSessionID string) (domain.ViewResult, error)
}
