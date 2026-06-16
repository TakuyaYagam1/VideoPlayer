import { createVideoCard } from './video-card.js';

export function createVideoList(videos) {
    const container = document.createElement('div');
    container.className = 'video-list';

    if (videos.length === 0) {
        container.innerHTML = '<p class="video-list__empty">Нет доступных видео</p>';
        return container;
    }

    videos.forEach(video => {
        const card = createVideoCard(video);
        container.appendChild(card);
    });

    return container;
}