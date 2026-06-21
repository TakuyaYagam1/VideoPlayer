export function bindVolumeControl(video, muteButton, volumeInput) {
    const update = () => {
        const muted = video.muted || video.volume === 0;
        muteButton.textContent = muted ? 'Вкл' : 'Выкл';
        muteButton.setAttribute('aria-label', muted ? 'Включить звук' : 'Выключить звук');
        muteButton.title = muted ? 'Включить звук' : 'Выключить звук';
        volumeInput.value = String(video.muted ? 0 : video.volume);
    };

    const toggleMute = () => {
        video.muted = !video.muted;
        update();
    };

    const changeVolume = () => {
        video.volume = Number(volumeInput.value);
        video.muted = video.volume === 0;
        update();
    };

    muteButton.addEventListener('click', toggleMute);
    volumeInput.addEventListener('input', changeVolume);
    update();

    return () => {
        muteButton.removeEventListener('click', toggleMute);
        volumeInput.removeEventListener('input', changeVolume);
    };
}
