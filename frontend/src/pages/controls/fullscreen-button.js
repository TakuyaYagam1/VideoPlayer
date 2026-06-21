export function bindFullscreenButton(target, button) {
    const update = () => {
        const active = document.fullscreenElement === target;
        button.textContent = active ? '↙' : '⛶';
        button.setAttribute('aria-label', active ? 'Выйти из полноэкранного режима' : 'Открыть полноэкранный режим');
        button.title = active ? 'Выйти из fullscreen' : 'Fullscreen';
    };

    const toggleFullscreen = () => {
        if (document.fullscreenElement) {
            void document.exitFullscreen();
            return;
        }

        void target.requestFullscreen();
    };

    button.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', update);
    update();

    return () => {
        button.removeEventListener('click', toggleFullscreen);
        document.removeEventListener('fullscreenchange', update);
    };
}
