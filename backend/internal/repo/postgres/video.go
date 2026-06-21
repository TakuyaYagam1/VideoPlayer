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

type VideoRepository struct {
	pool *pgxpool.Pool
}

func NewVideoRepository(pool *pgxpool.Pool) *VideoRepository {
	return &VideoRepository{pool: pool}
}

func (r *VideoRepository) List(ctx context.Context) ([]domain.Video, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT id, title, m3u8_url, views_count, created_at, updated_at
		FROM videos
		ORDER BY created_at DESC, title ASC
	`)
	if err != nil {
		return nil, fmt.Errorf("list videos: %w", err)
	}
	defer rows.Close()

	videos := make([]domain.Video, 0)
	for rows.Next() {
		video, err := scanVideo(rows)
		if err != nil {
			return nil, err
		}
		videos = append(videos, video)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate videos: %w", err)
	}

	return videos, nil
}

func (r *VideoRepository) Get(ctx context.Context, id uuid.UUID) (domain.Video, error) {
	row := r.pool.QueryRow(ctx, `
		SELECT id, title, m3u8_url, views_count, created_at, updated_at
		FROM videos
		WHERE id = $1
	`, id)

	video, err := scanVideo(row)
	if errors.Is(err, pgx.ErrNoRows) {
		return domain.Video{}, domain.ErrVideoNotFound
	}
	if err != nil {
		return domain.Video{}, err
	}

	return video, nil
}

type videoScanner interface {
	Scan(dest ...any) error
}

func scanVideo(row videoScanner) (domain.Video, error) {
	var video domain.Video
	if err := row.Scan(
		&video.ID,
		&video.Title,
		&video.M3U8URL,
		&video.Views,
		&video.CreatedAt,
		&video.UpdatedAt,
	); err != nil {
		return domain.Video{}, fmt.Errorf("scan video: %w", err)
	}

	return video, nil
}
