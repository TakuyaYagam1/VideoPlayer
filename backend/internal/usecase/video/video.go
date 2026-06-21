package video

import (
	"context"

	"github.com/google/uuid"

	"github.com/TakuyaYagam1/VideoPlayer/backend/internal/domain"
	"github.com/TakuyaYagam1/VideoPlayer/backend/internal/usecase"
)

type Service struct {
	repo usecase.VideoRepository
}

func New(repo usecase.VideoRepository) *Service {
	return &Service{repo: repo}
}

func (s *Service) List(ctx context.Context) ([]domain.Video, error) {
	return s.repo.List(ctx)
}

func (s *Service) Get(ctx context.Context, id uuid.UUID) (domain.Video, error) {
	return s.repo.Get(ctx, id)
}
