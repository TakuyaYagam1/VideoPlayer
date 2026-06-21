import { createVideoCard } from './video-card.js';

export function createVideoList(videos, navigate) {
    const container = document.createElement('div');
    container.className = 'video-list';

    if (videos.length === 0) {
        container.innerHTML = `
            <section class="empty-state">
                <p class="eyebrow">Пусто</p>
                <h2>Видео пока не добавлены</h2>
            </section>
        `;
        return container;
    }

    videos.forEach((video, index) => {
        const card = createVideoCard(video, {
            isFeatured: index === 0,
            onOpen: () => navigate(`/player?id=${encodeURIComponent(video.id)}`)
        });
        container.appendChild(card);
    });

    return container;
}
