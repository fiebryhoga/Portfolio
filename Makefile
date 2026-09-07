.PHONY: help dev-backend dev-frontend test-backend build-frontend docker-up docker-down docker-logs

help:
	@echo "Portfolio Project Commands:"
	@echo "  make dev-backend     - Run Go Gin backend locally (with SQLite fallback)"
	@echo "  make dev-frontend    - Run Next.js frontend in development mode"
	@echo "  make test-backend    - Run all Go unit & integration tests"
	@echo "  make build-frontend  - Build production Next.js frontend"
	@echo "  make docker-up       - Start PostgreSQL, Backend, and Frontend via Docker Compose"
	@echo "  make docker-down     - Stop and clean Docker Compose containers"
	@echo "  make docker-logs     - Follow container logs"

dev-backend:
	cd backend && go run cmd/main.go

dev-frontend:
	cd frontend && npm run dev

test-backend:
	cd backend && go test -v ./...

build-frontend:
	cd frontend && npm run build

docker-up:
	docker compose up --build -d

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f
