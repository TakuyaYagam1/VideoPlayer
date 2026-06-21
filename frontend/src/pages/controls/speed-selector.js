export function bindSpeedSelector(video, select) {
    const handleChange = () => {
        video.playbackRate = Number(select.value);
    };

    select.addEventListener('change', handleChange);
    video.playbackRate = Number(select.value);

    return () => {
        select.removeEventListener('change', handleChange);
    };
}
