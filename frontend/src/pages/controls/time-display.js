export function bindTimeDisplay(video, element) {
    const update = () => {
        const current = formatTime(video.currentTime);
        const duration = Number.isFinite(video.duration) ? formatTime(video.duration) : '00:00';
        element.textContent = `${current} / ${duration}`;
    };

    video.addEventListener('timeupdate', update);
    video.addEventListener('loadedmetadata', update);
    update();

    return () => {
        video.removeEventListener('timeupdate', update);
        video.removeEventListener('loadedmetadata', update);
    };
}

function formatTime(seconds) {
    const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
    const minutes = Math.floor(safeSeconds / 60);
    const rest = Math.floor(safeSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}
