export function createVideoCard(video, { isFeatured, onOpen }) {
    const card = document.createElement('article');
    card.className = isFeatured ? 'video-card video-card--featured' : 'video-card';

    const preview = document.createElement('button');
    preview.className = 'video-card__preview';
    preview.type = 'button';
    preview.setAttribute('aria-label', `Открыть видео ${video.title}`);
    preview.addEventListener('click', onOpen);

    if (video.preview_url) {
        const image = document.createElement('img');
        image.className = 'video-card__image';
        image.src = video.preview_url;
        image.alt = '';
        image.loading = 'lazy';
        image.decoding = 'async';
        image.addEventListener('error', () => image.remove());
        preview.appendChild(image);
    }

    const playIcon = document.createElement('span');
    playIcon.className = 'video-card__play';
    playIcon.textContent = '▶';

    preview.appendChild(playIcon);

    const title = document.createElement('h3');
    title.className = 'video-card__title';
    title.textContent = video.title;

    const views = document.createElement('p');
    views.className = 'video-card__views';
    views.textContent = `${video.views} просмотров`;

    const link = document.createElement('button');
    link.className = 'video-card__btn';
    link.type = 'button';
    link.textContent = 'Смотреть';
    link.addEventListener('click', onOpen);

    card.append(preview, title, views, link);

    return card;
}
