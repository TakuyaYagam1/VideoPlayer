import { getVideo } from '../../api/videos.js';
import { bindFullscreenButton } from '../controls/fullscreen-button.js';
import { bindPlayPause } from '../controls/play-pause.js';
import { bindProgressBar } from '../controls/progress-bar.js';
import { bindQualitySelector } from '../controls/quality-selector.js';
import { bindSpeedSelector } from '../controls/speed-selector.js';
import { bindTimeDisplay } from '../controls/time-display.js';
import { bindVolumeControl } from '../controls/volume-control.js';
import { attachHlsPlayer } from './hls-player.js';
import { renderPlayerError } from './player-errors.js';
import { getPlayerVideoId } from './player-router.js';
import { bindViewCounter } from './view-counter.js';

export async function renderPlayerPage({ app, params, navigate }) {
    const videoId = getPlayerVideoId(params);

    if (!videoId) {
        renderPlayerError(app, navigate, 'Не передан id видео');
        return;
    }

    app.innerHTML = `
        <section class="player-page">
            <div class="player-page__topline">
                <button class="button button--ghost" type="button" data-back>← Назад</button>
                <span class="player-page__loading">Загрузка видео...</span>
            </div>
        </section>
    `;
    app.querySelector('[data-back]').addEventListener('click', () => navigate('/'));

    try {
        const video = await getVideo(videoId);
        return mountPlayer(app, navigate, video);
    } catch (error) {
        renderPlayerError(app, navigate, error.message);
    }
}

function mountPlayer(app, navigate, videoData) {
    app.innerHTML = `
        <section class="player-page">
            <div class="player-page__topline">
                <button class="button button--ghost" type="button" data-back>← Назад</button>
                <div class="player-page__meta">
                    <p class="eyebrow">Сейчас играет</p>
                    <h1 data-title></h1>
                </div>
            </div>

            <div class="player-layout">
                <section class="player-panel" data-player-shell>
                    <div class="player-stage">
                        <video class="video-player" preload="metadata" playsinline data-video></video>
                        <button class="player-overlay-toggle" type="button" data-overlay-play aria-label="Запустить видео">▶</button>
                        <p class="player-status" data-player-status>Подготовка потока...</p>
                    </div>

                    <div class="player-controls" aria-label="Управление плеером">
                        <button class="control-button control-button--primary" type="button" data-play>▶</button>
                        <span class="time-display" data-time>00:00 / 00:00</span>
                        <input class="progress-bar" type="range" min="0" max="100" step="0.1" value="0" aria-label="Позиция видео" data-progress />
                        <button class="control-button" type="button" data-mute>Выкл</button>
                        <input class="volume-bar" type="range" min="0" max="1" step="0.05" value="1" aria-label="Громкость" data-volume />
                        <select class="control-select" aria-label="Скорость" data-speed>
                            <option value="0.5">0.5x</option>
                            <option value="0.75">0.75x</option>
                            <option value="1" selected>1x</option>
                            <option value="1.25">1.25x</option>
                            <option value="1.5">1.5x</option>
                            <option value="2">2x</option>
                        </select>
                        <select class="control-select" aria-label="Качество" data-quality></select>
                        <button class="control-button" type="button" data-fullscreen>⛶</button>
                    </div>
                </section>

                <aside class="player-sidebar">
                    <p class="eyebrow">Видео</p>
                    <h2 data-sidebar-title></h2>
                    <dl class="player-facts">
                        <div>
                            <dt>Просмотры</dt>
                            <dd data-views></dd>
                        </div>
                        <div>
                            <dt>Формат</dt>
                            <dd>HLS</dd>
                        </div>
                    </dl>
                    <p class="player-message" data-view-message></p>
                </aside>
            </div>
        </section>
    `;

    app.querySelector('[data-title]').textContent = videoData.title;
    app.querySelector('[data-sidebar-title]').textContent = videoData.title;
    app.querySelector('[data-views]').textContent = formatViews(videoData.views);

    const video = app.querySelector('[data-video]');
    const stage = app.querySelector('.player-stage');
    const shell = app.querySelector('[data-player-shell]');
    const status = app.querySelector('[data-player-status]');
    const viewMessage = app.querySelector('[data-view-message]');
    const views = app.querySelector('[data-views]');
    const cleanups = [];

    if (videoData.preview_url) {
        video.poster = videoData.preview_url;
    }

    const quality = bindQualitySelector(app.querySelector('[data-quality]'), (levelIndex) => {
        player.setQuality(levelIndex);
    });

    const player = attachHlsPlayer(video, videoData.m3u8_url, {
        onLevels: (levels) => quality.setLevels(levels),
        onError: (message) => {
            status.textContent = message;
            status.hidden = false;
        }
    });

    cleanups.push(
        () => quality.destroy(),
        player.destroy,
        bindPlayPause(video, app.querySelector('[data-play]')),
        bindPlayPause(video, app.querySelector('[data-overlay-play]')),
        bindTimeDisplay(video, app.querySelector('[data-time]')),
        bindProgressBar(video, app.querySelector('[data-progress]')),
        bindVolumeControl(video, app.querySelector('[data-mute]'), app.querySelector('[data-volume]')),
        bindSpeedSelector(video, app.querySelector('[data-speed]')),
        bindFullscreenButton(shell, app.querySelector('[data-fullscreen]')),
        bindViewCounter(video, videoData.id, {
            onRecorded(result) {
                views.textContent = formatViews(result.views);
                viewMessage.textContent = result.counted ? 'Просмотр засчитан' : 'Просмотр уже был засчитан';
            },
            onError(error) {
                viewMessage.textContent = `Не удалось обновить просмотры: ${error.message}`;
            }
        })
    );

    const hideStatus = () => {
        status.hidden = true;
    };

    video.addEventListener('canplay', hideStatus);
    cleanups.push(() => video.removeEventListener('canplay', hideStatus));

    const updateStageState = () => {
        stage.classList.toggle('is-paused', video.paused);
    };

    video.addEventListener('play', updateStageState);
    video.addEventListener('pause', updateStageState);
    updateStageState();
    cleanups.push(() => {
        video.removeEventListener('play', updateStageState);
        video.removeEventListener('pause', updateStageState);
    });

    app.querySelector('[data-back]').addEventListener('click', () => navigate('/'));

    return () => {
        cleanups.forEach((cleanup) => cleanup());
        video.pause();
        video.removeAttribute('src');
        video.load();
    };
}

function formatViews(views) {
    return new Intl.NumberFormat('ru-RU').format(views);
}
