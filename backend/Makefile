.PHONY: help dev dev-backend migrate seed test

help:
	@echo "Laravel Backend Commands:"
	@echo "  make dev         - Run Laravel backend on port 8080"
	@echo "  make dev-backend - Run Laravel backend on port 8080"
	@echo "  make migrate     - Run database migrations and seeders"
	@echo "  make test        - Run PHPUnit tests"

dev:
	php artisan serve --port=8080

dev-backend:
	php artisan serve --port=8080

migrate:
	php artisan migrate:fresh --seed

test:
	php artisan test
