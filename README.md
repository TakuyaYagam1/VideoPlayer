# IfBest Video Player

HLS-видеоплеер с переключением качества, скоростью, полноэкранным режимом и счётчиком просмотров.

## Стек

- **Backend**: Python 3.14 + FastAPI + SQLite (aiosqlite + SQLAlchemy async)
- **Frontend**: React 19 + Vite 6 + TypeScript 5.7 + HLS.js 1.6.16

## Быстрый старт

### Backend

```bash
cd VideoPlayer/python-backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API будет доступен на http://localhost:8000

### Frontend

```bash
cd VideoPlayer/frontend
npm install
npm run dev
```

Откроется на http://localhost:5173

## Тестовые потоки (HLS, мультибитрейт)

- Apple BipBop: `https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8`
- Mux test: `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`

## Структура проекта

```
tasks.json            ← план задач
progress.md           ← трекинг прогресса
VideoPlayer/
├── backend/          ← Go-бэкенд (существующий)
├── python-backend/   ← Python FastAPI (новый)
│   ├── main.py
│   ├── requirements.txt
│   └── venv/
└── frontend/         ← React 19 + Vite + TypeScript
    ├── src/
    ├── vite.config.ts
    └── package.json
```
