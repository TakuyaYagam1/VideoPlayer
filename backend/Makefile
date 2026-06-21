DATABASE_URL ?= postgres://ifbest:ifbest@localhost:5432/ifbest_video_player?sslmode=disable
OGEN_VERSION ?= v1.22.0
SQLC_VERSION ?= v1.31.1
GOOSE_VERSION ?= v3.27.1
GOLANGCI_LINT_VERSION ?= v2.12.2

.PHONY: generate openapi sqlc test fmt fmt-check lint tidy-check migrate migrate-down build

generate: openapi sqlc

openapi:
	go run github.com/ogen-go/ogen/cmd/ogen@$(OGEN_VERSION) \
		--config codegen/ogen.yml \
		--target api \
		--package openapi \
		api/openapi.yml

sqlc:
	go run github.com/sqlc-dev/sqlc/cmd/sqlc@$(SQLC_VERSION) generate -f codegen/sqlc.yml

test:
	go test ./...

fmt:
	gofmt -w $$(find . -name '*.go' -not -path './api/oas_*_gen.go' -not -path './internal/repo/postgres/sqlc/*')

fmt-check:
	test -z "$$(gofmt -l $$(find . -name '*.go' -not -path './api/oas_*_gen.go' -not -path './internal/repo/postgres/sqlc/*'))"

lint:
	go run github.com/golangci/golangci-lint/v2/cmd/golangci-lint@$(GOLANGCI_LINT_VERSION) run ./...

tidy-check:
	go mod tidy
	git diff --exit-code -- go.mod go.sum

migrate:
	DATABASE_URL="$(DATABASE_URL)" go run ./cmd/migrate up

migrate-down:
	DATABASE_URL="$(DATABASE_URL)" go run ./cmd/migrate down

build:
	go build -trimpath -o bin/app ./cmd/app
	go build -trimpath -o bin/migrate ./cmd/migrate
