import { createVideoList } from './video-list.js';

export async function renderCatalogPage() {
    const root = document.getElementById('app');

    root.innerHTML = `
        <div class="catalog-page">
            <div class="catalog-page__header">
                <h1>Корпоративная видеотека IfBest</h1>
                <p>Обучающие видео, инструкции и записи совещаний</p>
            </div>
            <div class="catalog-page__content" id="catalog-content">
                <p class="catalog-page__loading">Загрузка видео...</p>
            </div>
        </div>
    `;

    const content = document.getElementById('catalog-content');

    try {
        const response = await fetch('/api/videos');
        const videos = await response.json();
        const list = createVideoList(videos);
        content.innerHTML = '';
        content.appendChild(list);
    } catch (error) {
        content.innerHTML = '<p class="catalog-page__error">Ошибка загрузки видео</p>';
        console.error('Ошибка загрузки:', error);
    }
}