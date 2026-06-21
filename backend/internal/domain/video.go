package domain

import (
	"errors"
	"time"

	"github.com/google/uuid"
)

var ErrVideoNotFound = errors.New("video not found")

type Video struct {
	ID        uuid.UUID
	Title     string
	M3U8URL   string
	Views     int64
	CreatedAt time.Time
	UpdatedAt time.Time
}
