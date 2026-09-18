.PHONY: help dev-backend dev-frontend test-backend build-frontend migrate seed docker-up docker-down docker-logs

help:
	@echo "Portfolio Project Commands:"
	@echo "  make dev-backend     - Run Laravel 12 backend locally (http://localhost:8080)"
	@echo "  make dev-frontend    - Run Next.js frontend in development mode (http://localhost:3000)"
	@echo "  make migrate         - Run Laravel database migrations & seeders"
	@echo "  make test-backend    - Run PHPUnit tests"
	@echo "  make build-frontend  - Build production Next.js frontend"
	@echo "  make docker-up       - Start MySQL, Laravel Backend, and Frontend via Docker Compose"
	@echo "  make docker-down     - Stop and clean Docker Compose containers"
	@echo "  make docker-logs     - Follow container logs"

dev-backend:
	cd backend && php artisan serve --port=8080

dev-frontend:
	cd frontend && npm run dev

migrate:
	cd backend && php artisan migrate:fresh --seed

test-backend:
	cd backend && php artisan test

build-frontend:
	cd frontend && npm run build

docker-up:
	docker compose up --build -d

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f
