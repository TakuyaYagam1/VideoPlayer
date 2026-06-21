const API_BASE_URL = '/api/v1';
const VIDEO_PREVIEWS = new Map([
    [
        '019f1a73-3ed1-7511-8b12-03a7a16fd001',
        'https://upload.wikimedia.org/wikipedia/commons/c/c5/Big_buck_bunny_poster_big.jpg'
    ],
    [
        '019f1a73-3ed1-7511-8b12-03a7a16fd002',
        'https://upload.wikimedia.org/wikipedia/commons/8/8f/Sintel_poster.jpg'
    ],
    [
        '019f1a73-3ed1-7511-8b12-03a7a16fd003',
        'https://mango.blender.org/wp-content/uploads/2013/05/01_thom_celia_bridge.jpg'
    ]
]);

async function request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    });

    if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.error?.message ?? `HTTP ${response.status}`;
        throw new Error(message);
    }

    return response.json();
}

export function listVideos() {
    return request('/videos').then((videos) => videos.map(normalizeVideo));
}

export function getVideo(videoId) {
    return request(`/videos/${encodeURIComponent(videoId)}`).then(normalizeVideo);
}

export function recordVideoView(videoId, viewSessionId) {
    return request(`/videos/${encodeURIComponent(videoId)}/views`, {
        method: 'POST',
        body: JSON.stringify({
            view_session_id: viewSessionId
        })
    });
}

function normalizeVideo(video) {
    return {
        ...video,
        preview_url: video.preview_url ?? VIDEO_PREVIEWS.get(video.id) ?? ''
    };
}
