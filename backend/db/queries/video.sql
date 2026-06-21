-- name: ListVideos :many
SELECT id, title, m3u8_url, views_count, created_at, updated_at
FROM videos
ORDER BY created_at DESC, title ASC;

-- name: GetVideo :one
SELECT id, title, m3u8_url, views_count, created_at, updated_at
FROM videos
WHERE id = $1;

-- name: InsertViewEvent :execrows
INSERT INTO video_view_events (id, video_id, view_session_id, created_at)
VALUES ($1, $2, $3, now())
ON CONFLICT (video_id, view_session_id) DO NOTHING;

-- name: IncrementVideoViews :one
UPDATE videos
SET views_count = views_count + 1,
    updated_at = now()
WHERE id = $1
RETURNING views_count;
