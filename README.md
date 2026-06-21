# IfBest Video Player

HLS-видеоплеер с переключением качества, управлением скоростью, полноэкранным режимом и счётчиком просмотров.

## Стек

| Компонент | Технологии |
|-----------|-----------|
| Backend   | Python 3.14 · FastAPI 0.137.2 · SQLite (aiosqlite 0.21.0) · SQLAlchemy 2.0.43 async |
| Frontend  | React 19.2 · Vite 6 · TypeScript 5.7 · HLS.js 1.6.16 |

## Быстрый старт

### Backend

```bash
cd VideoPlayer/python-backend

# Windows
python -m venv venv
venv\Scripts\activate

# Linux / macOS
python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API будет доступен на `http://localhost:8000`.  
При первом запуске создаётся `ifbest.db` с 3 тестовыми HLS-потоками.

### Frontend

```bash
cd VideoPlayer/frontend
npm install
npm run dev
```

Откроется на `http://localhost:5173`.  
Vite автоматически проксирует `/api → http://localhost:8000`.

## API

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/videos` | Список видео: `[{id, title, m3u8_url, views}]` |
| POST | `/api/videos/{id}/view` | +1 просмотр атомарно, возвращает `{views}` |

## Возможности плеера

- **Play / Pause** — синхронизировано с событиями `<video>`, корректно при autoplay-блокировке
- **Прогресс-бар** — перемотка, `mm:ss` / `mm:ss`, индикатор `LIVE` для live-потоков
- **Выбор качества** — меню из HLS-уровней (`MANIFEST_PARSED`), Auto / 720p / 1080p и т.д.
- **Скорость** — 0.5x · 0.75x · 1x · 1.25x · 1.5x · 2x
- **Fullscreen** — на контейнере плеера (контролы остаются), Safari webkit-prefix
- **Счётчик просмотров** — POST только при первом `play` в сессии; смена видео сбрасывает флаг

## Тестовые HLS-потоки (мультибитрейт)

```
Apple BipBop:  https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8
Mux test:      https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
Apple Adv HLS: https://devstreaming-cdn.apple.com/videos/streaming/examples/adv_dv_atmos/main.m3u8
```

## Структура проекта

```
VideoPlayer/
├── python-backend/        ← FastAPI (Python)
│   ├── main.py            ← lifespan, CORS
│   ├── database.py        ← SQLAlchemy async engine
│   ├── models.py          ← Video ORM-модель
│   ├── router.py          ← GET /api/videos, POST /api/videos/{id}/view
│   ├── schemas.py         ← Pydantic v2 schemas
│   ├── seed.py            ← тестовые данные
│   └── requirements.txt
├── frontend/              ← React 19 + Vite + TypeScript
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── Player.tsx     ← все контролы плеера
│       ├── VideoList.tsx
│       ├── useHls.ts      ← HLS.js хук с Safari-fallback
│       ├── api.ts         ← getVideos, recordView
│       ├── types.ts
│       └── index.css      ← тёмная тема, accent #e31c1c
└── backend/               ← Go (существующий)
```

## Ветка разработки

`Debic-controls` — все изменения находятся в этой ветке.
