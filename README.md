# IfBest Video Player

V1 is a simple HLS video player stack: static HTML/CSS/JS frontend, Go backend,
PostgreSQL storage, migrations, and Caddy as a single local entrypoint.

## Local Run

```bash
docker compose -f deployment/docker/docker-compose.yml up -d --build
```

Open:

- frontend through Caddy: `http://localhost`
- backend through Caddy: `http://localhost/api/v1/videos`
- backend direct: `http://localhost:18080`

If a local port is busy, override compose ports:

```bash
HTTP_PORT=8081 BACKEND_PORT=18080 POSTGRES_PORT=15432 docker compose -f deployment/docker/docker-compose.yml up -d --build
```

Stop and remove local data:

```bash
docker compose -f deployment/docker/docker-compose.yml down -v
```

## Backend

```bash
cd backend
go mod tidy
make generate
make test
make migrate
```

Required environment:

- `APP_ENV`, default `local`
- `HTTP_ADDR`, default `:8080`
- `DATABASE_URL`, default local PostgreSQL URL
- `SHUTDOWN_TIMEOUT`, default `10s`

API:

- `GET /healthz`
- `GET /readyz`
- `GET /api/v1/videos`
- `GET /api/v1/videos/{id}`
- `POST /api/v1/videos/{id}/views`

## CI

GitHub Actions runs frontend lint, backend generation/format/lint/tests,
migrations against clean PostgreSQL, and a Docker Compose smoke check.
