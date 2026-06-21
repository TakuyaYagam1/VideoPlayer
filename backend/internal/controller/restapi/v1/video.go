package v1

import (
	"errors"
	"net/http"
)

func (h *Handler) listVideos(w http.ResponseWriter, r *http.Request) {
	videos, err := h.video.List(r.Context())
	if err != nil {
		h.handleError(w, r, err)
		return
	}

	response := make([]videoResponse, 0, len(videos))
	for _, item := range videos {
		response = append(response, toVideoResponse(item))
	}

	writeJSON(w, http.StatusOK, response)
}

func (h *Handler) getVideo(w http.ResponseWriter, r *http.Request) {
	videoID, ok := parseVideoID(r)
	if !ok {
		writeError(w, r, http.StatusBadRequest, "invalid_video_id", errors.New("invalid video id"))
		return
	}

	video, err := h.video.Get(r.Context(), videoID)
	if err != nil {
		h.handleError(w, r, err)
		return
	}

	writeJSON(w, http.StatusOK, toVideoResponse(video))
}
