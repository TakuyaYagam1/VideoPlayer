package v1

import (
	"encoding/json"
	"errors"
	"net/http"
)

func (h *Handler) recordView(w http.ResponseWriter, r *http.Request) {
	videoID, ok := parseVideoID(r)
	if !ok {
		writeError(w, r, http.StatusBadRequest, "invalid_video_id", errors.New("invalid video id"))
		return
	}

	var request viewRequest
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&request); err != nil {
		writeError(w, r, http.StatusBadRequest, "invalid_request_body", errors.New("invalid request body"))
		return
	}

	result, err := h.view.Record(r.Context(), videoID, request.ViewSessionID)
	if err != nil {
		h.handleError(w, r, err)
		return
	}

	writeJSON(w, http.StatusOK, viewResponse{
		VideoID: result.VideoID.String(),
		Views:   result.Views,
		Counted: result.Counted,
	})
}
