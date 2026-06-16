export function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'video-card';

    const title = document.createElement('h3');
    title.className = 'video-card__title';
    title.textContent = video.title;

    const views = document.createElement('p');
    views.className = 'video-card__views';
    views.innerHTML = `Просмотров: <span>${video.views}</span>`;

    const link = document.createElement('a');
    link.className = 'video-card__btn';
    link.href = `/player?id=${video.id}`;
    link.textContent = 'Смотреть';

    card.appendChild(title);
    card.appendChild(views);
    card.appendChild(link);

    return card;
}