export function bindPlayPause(video, button) {
    const update = () => {
        button.textContent = video.paused ? '▶' : '⏸';
        button.setAttribute('aria-label', video.paused ? 'Запустить видео' : 'Поставить на паузу');
        button.title = video.paused ? 'Воспроизвести' : 'Пауза';
    };

    const handleClick = () => {
        if (video.paused) {
            void video.play();
            return;
        }

        video.pause();
    };

    button.addEventListener('click', handleClick);
    video.addEventListener('play', update);
    video.addEventListener('pause', update);
    update();

    return () => {
        button.removeEventListener('click', handleClick);
        video.removeEventListener('play', update);
        video.removeEventListener('pause', update);
    };
}
