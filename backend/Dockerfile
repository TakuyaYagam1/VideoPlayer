FROM golang:1.26.3-alpine AS build

WORKDIR /src

RUN apk add --no-cache ca-certificates

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/app ./cmd/app
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/migrate ./cmd/migrate

FROM alpine:3.22

RUN addgroup -S app && adduser -S -G app app
RUN apk add --no-cache ca-certificates

WORKDIR /app

COPY --from=build /out/app /usr/local/bin/app
COPY --from=build /out/migrate /usr/local/bin/migrate
COPY --from=build /src/db/migrations ./db/migrations

USER app
EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/app"]
