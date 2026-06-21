import { renderCatalogPage } from './pages/catalog/catalog-page.js';
import { renderPlayerPage } from './pages/player/player-page.js';

const app = document.getElementById('app');
let cleanupPage = () => {};

function navigate(url) {
    window.history.pushState({}, '', url);
    void renderCurrentRoute();
}

function getRoute() {
    return {
        path: window.location.pathname,
        params: new URLSearchParams(window.location.search)
    };
}

async function renderCurrentRoute() {
    cleanupPage();
    cleanupPage = () => {};

    const route = getRoute();
    const context = {
        app,
        params: route.params,
        navigate
    };

    if (route.path === '/' || route.path === '/index.html') {
        cleanupPage = (await renderCatalogPage(context)) ?? cleanupPage;
        return;
    }

    if (route.path === '/player') {
        cleanupPage = (await renderPlayerPage(context)) ?? cleanupPage;
        return;
    }

    app.innerHTML = `
        <section class="empty-state">
            <p class="eyebrow">404</p>
            <h1>Страница не найдена</h1>
            <button class="button button--primary" type="button" data-home>К списку видео</button>
        </section>
    `;
    app.querySelector('[data-home]').addEventListener('click', () => navigate('/'));
}

document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-link]');
    if (!link) {
        return;
    }

    const url = new URL(link.href);
    if (url.origin !== window.location.origin) {
        return;
    }

    event.preventDefault();
    navigate(`${url.pathname}${url.search}`);
});

window.addEventListener('popstate', () => {
    void renderCurrentRoute();
});

void renderCurrentRoute();
