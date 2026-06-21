package domain

import (
	"errors"

	"github.com/google/uuid"
)

var ErrInvalidViewSession = errors.New("view_session_id is required")

type ViewResult struct {
	VideoID uuid.UUID
	Views   int64
	Counted bool
}
