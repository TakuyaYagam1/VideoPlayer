-- +goose Up
CREATE TABLE videos (
    id uuid PRIMARY KEY,
    title text NOT NULL,
    m3u8_url text NOT NULL,
    views_count bigint NOT NULL DEFAULT 0 CHECK (views_count >= 0),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE video_view_events (
    id uuid PRIMARY KEY,
    video_id uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    view_session_id text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT video_view_events_session_not_empty CHECK (length(btrim(view_session_id)) > 0)
);

CREATE UNIQUE INDEX video_view_events_video_session_uq
    ON video_view_events (video_id, view_session_id);

INSERT INTO videos (id, title, m3u8_url, views_count, created_at, updated_at)
VALUES
    (
        '019f1a73-3ed1-7511-8b12-03a7a16fd001',
        'IfBest demo: Big Buck Bunny',
        'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        0,
        now(),
        now()
    ),
    (
        '019f1a73-3ed1-7511-8b12-03a7a16fd002',
        'IfBest demo: Sintel',
        'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
        0,
        now(),
        now()
    ),
    (
        '019f1a73-3ed1-7511-8b12-03a7a16fd003',
        'IfBest demo: Tears of Steel',
        'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
        0,
        now(),
        now()
    );

-- +goose Down
DROP TABLE IF EXISTS video_view_events;
DROP TABLE IF EXISTS videos;
