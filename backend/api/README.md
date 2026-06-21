# OpenAPI

`openapi.yml` is the v1 HTTP contract for the backend API.

Generation is owned by the backend `Makefile`:

```bash
make generate
make openapi
make sqlc
```

The project uses `ogen` for OpenAPI code generation. Generated OpenAPI code goes to
this `api/` package as `oas_*_gen.go` files and should be refreshed through
`make openapi`, not edited by hand.
