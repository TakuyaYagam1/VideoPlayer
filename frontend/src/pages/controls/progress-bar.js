export function bindProgressBar(video, progress) {
    const update = () => {
        if (!Number.isFinite(video.duration) || video.duration <= 0) {
            progress.value = '0';
            return;
        }

        progress.value = String((video.currentTime / video.duration) * 100);
    };

    const seek = () => {
        if (!Number.isFinite(video.duration) || video.duration <= 0) {
            return;
        }

        video.currentTime = (Number(progress.value) / 100) * video.duration;
    };

    progress.addEventListener('input', seek);
    video.addEventListener('timeupdate', update);
    video.addEventListener('loadedmetadata', update);

    return () => {
        progress.removeEventListener('input', seek);
        video.removeEventListener('timeupdate', update);
        video.removeEventListener('loadedmetadata', update);
    };
}
