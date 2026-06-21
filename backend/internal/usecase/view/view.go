package view

import (
	"context"
	"strings"

	"github.com/google/uuid"

	"github.com/TakuyaYagam1/VideoPlayer/backend/internal/domain"
	"github.com/TakuyaYagam1/VideoPlayer/backend/internal/usecase"
)

const maxViewSessionIDLength = 128

type Service struct {
	repo usecase.ViewRepository
}

func New(repo usecase.ViewRepository) *Service {
	return &Service{repo: repo}
}

func (s *Service) Record(ctx context.Context, videoID uuid.UUID, viewSessionID string) (domain.ViewResult, error) {
	viewSessionID = strings.TrimSpace(viewSessionID)
	if viewSessionID == "" || len(viewSessionID) > maxViewSessionIDLength {
		return domain.ViewResult{}, domain.ErrInvalidViewSession
	}

	return s.repo.Record(ctx, videoID, viewSessionID)
}
