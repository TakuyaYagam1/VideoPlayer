package postgres

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/TakuyaYagam1/VideoPlayer/backend/internal/domain"
)

type ViewRepository struct {
	pool *pgxpool.Pool
}

func NewViewRepository(pool *pgxpool.Pool) *ViewRepository {
	return &ViewRepository{pool: pool}
}

func (r *ViewRepository) Record(ctx context.Context, videoID uuid.UUID, viewSessionID string) (domain.ViewResult, error) {
	tx, err := r.pool.BeginTx(ctx, pgx.TxOptions{IsoLevel: pgx.ReadCommitted})
	if err != nil {
		return domain.ViewResult{}, fmt.Errorf("begin view transaction: %w", err)
	}
	defer func() {
		_ = tx.Rollback(ctx)
	}()

	var views int64
	if err := tx.QueryRow(ctx, `
		SELECT views_count
		FROM videos
		WHERE id = $1
		FOR UPDATE
	`, videoID).Scan(&views); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return domain.ViewResult{}, domain.ErrVideoNotFound
		}
		return domain.ViewResult{}, fmt.Errorf("lock video for view: %w", err)
	}

	eventID := uuid.New()
	tag, err := tx.Exec(ctx, `
		INSERT INTO video_view_events (id, video_id, view_session_id, created_at)
		VALUES ($1, $2, $3, now())
		ON CONFLICT (video_id, view_session_id) DO NOTHING
	`, eventID, videoID, viewSessionID)
	if err != nil {
		return domain.ViewResult{}, fmt.Errorf("insert view event: %w", err)
	}

	counted := tag.RowsAffected() == 1
	if counted {
		if err := tx.QueryRow(ctx, `
			UPDATE videos
			SET views_count = views_count + 1,
			    updated_at = now()
			WHERE id = $1
			RETURNING views_count
		`, videoID).Scan(&views); err != nil {
			return domain.ViewResult{}, fmt.Errorf("increment video views: %w", err)
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return domain.ViewResult{}, fmt.Errorf("commit view transaction: %w", err)
	}

	return domain.ViewResult{
		VideoID: videoID,
		Views:   views,
		Counted: counted,
	}, nil
}
