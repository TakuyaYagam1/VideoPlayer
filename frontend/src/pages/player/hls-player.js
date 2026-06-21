const QUALITY_PRESETS = [144, 360, 720, 1080];

export function attachHlsPlayer(video, streamUrl, { onLevels, onError }) {
    const Hls = window.Hls;

    if (Hls?.isSupported()) {
        const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false
        });

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            onLevels(createQualityLevels(hls.levels));
        });

        hls.on(Hls.Events.ERROR, (_event, data) => {
            if (!data.fatal) {
                return;
            }

            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                onError('Проблема с сетью, пробую переподключиться...');
                hls.startLoad();
                return;
            }

            if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                onError('Проблема с медиапотоком, пробую восстановить плеер...');
                hls.recoverMediaError();
                return;
            }

            onError('Не удалось воспроизвести HLS-поток');
            hls.destroy();
        });

        hls.loadSource(streamUrl);
        hls.attachMedia(video);

        return {
            setQuality(levelIndex) {
                hls.currentLevel = levelIndex;
            },
            destroy() {
                hls.destroy();
            }
        };
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        onLevels([]);

        return {
            setQuality(_levelIndex) {},
            destroy() {
                video.removeAttribute('src');
                video.load();
            }
        };
    }

    throw new Error('Браузер не поддерживает HLS');
}

function createQualityLevels(levels) {
    const levelsWithHeight = levels
        .map((level, index) => ({
            index,
            height: level.height
        }))
        .filter((level) => Number.isFinite(level.height) && level.height > 0);

    if (levelsWithHeight.length === 0) {
        return levels.map((level, index) => ({
            index,
            label: level.height ? `${level.height}p` : `${Math.round(level.bitrate / 1000)} kbps`
        }));
    }

    const usedIndexes = new Set();

    return QUALITY_PRESETS.map((preset) => ({
        index: findClosestLevelIndex(levelsWithHeight, preset, usedIndexes),
        label: `${preset}p`
    })).filter((level) => level.index !== null);
}

function findClosestLevelIndex(levels, targetHeight, usedIndexes) {
    const level = [...levels]
        .filter((candidate) => !usedIndexes.has(candidate.index))
        .sort((left, right) => {
            const distance = Math.abs(left.height - targetHeight) - Math.abs(right.height - targetHeight);

            if (distance !== 0) {
                return distance;
            }

            return left.height - right.height;
        })[0];

    if (!level) {
        return null;
    }

    usedIndexes.add(level.index);
    return level.index;
}
