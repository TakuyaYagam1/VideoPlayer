export function renderPlayerError(app, navigate, message) {
    app.innerHTML = '';

    const section = document.createElement('section');
    section.className = 'empty-state empty-state--wide';

    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = 'Плеер';

    const title = document.createElement('h1');
    title.textContent = 'Видео недоступно';

    const details = document.createElement('p');
    details.textContent = message;

    const button = document.createElement('button');
    button.className = 'button button--primary';
    button.type = 'button';
    button.textContent = 'К списку видео';
    button.addEventListener('click', () => navigate('/'));

    section.append(eyebrow, title, details, button);
    app.appendChild(section);
}
