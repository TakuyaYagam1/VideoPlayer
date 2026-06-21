import { createVideoList } from './video-list.js';
import { listVideos } from '../../api/videos.js';

export async function renderCatalogPage({ app, navigate }) {
    app.innerHTML = `
        <div class="catalog-page">
            <div class="catalog-page__header">
                <p class="eyebrow">Видео</p>
                <h1>Главная</h1>
            </div>
            <div class="catalog-page__content" id="catalog-content">
                <p class="catalog-page__loading">Загрузка видео...</p>
            </div>
        </div>
    `;

    const content = document.getElementById('catalog-content');

    try {
        const videos = await listVideos();
        const list = createVideoList(videos, navigate);
        content.innerHTML = '';
        content.appendChild(list);
    } catch (error) {
        content.innerHTML = '';
        content.appendChild(createCatalogError(error.message));
        console.error('Ошибка загрузки:', error);
    }
}

function createCatalogError(message) {
    const section = document.createElement('section');
    section.className = 'empty-state';

    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = 'Ошибка';

    const title = document.createElement('h2');
    title.textContent = 'Не удалось загрузить список видео';

    const details = document.createElement('p');
    details.textContent = message;

    section.append(eyebrow, title, details);
    return section;
}
