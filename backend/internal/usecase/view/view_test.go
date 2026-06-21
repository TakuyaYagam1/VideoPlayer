package view_test

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"

	"github.com/TakuyaYagam1/VideoPlayer/backend/internal/domain"
	viewusecase "github.com/TakuyaYagam1/VideoPlayer/backend/internal/usecase/view"
)

func TestServiceRecordValidatesViewSessionID(t *testing.T) {
	t.Parallel()

	service := viewusecase.New(fakeViewRepository{})

	_, err := service.Record(context.Background(), uuid.New(), " ")
	if !errors.Is(err, domain.ErrInvalidViewSession) {
		t.Fatalf("expected ErrInvalidViewSession, got %v", err)
	}
}

func TestServiceRecordDelegatesToRepository(t *testing.T) {
	t.Parallel()

	videoID := uuid.New()
	service := viewusecase.New(fakeViewRepository{
		result: domain.ViewResult{
			VideoID: videoID,
			Views:   1,
			Counted: true,
		},
	})

	result, err := service.Record(context.Background(), videoID, "session-1")
	if err != nil {
		t.Fatalf("record view: %v", err)
	}
	if result.VideoID != videoID || result.Views != 1 || !result.Counted {
		t.Fatalf("unexpected result: %#v", result)
	}
}

type fakeViewRepository struct {
	result domain.ViewResult
}

func (r fakeViewRepository) Record(context.Context, uuid.UUID, string) (domain.ViewResult, error) {
	return r.result, nil
}
