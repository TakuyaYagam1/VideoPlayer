import { recordVideoView } from '../../api/videos.js';

export function bindViewCounter(video, videoId, { onRecorded, onError }) {
    const viewSessionId = createViewSessionId(videoId);
    let recorded = false;

    const record = async () => {
        if (recorded) {
            return;
        }

        recorded = true;

        try {
            const result = await recordVideoView(videoId, viewSessionId);
            onRecorded(result);
        } catch (error) {
            onError(error);
        }
    };

    video.addEventListener('play', record, { once: true });

    return () => {
        video.removeEventListener('play', record);
    };
}

function createViewSessionId(videoId) {
    if (crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `${videoId}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
