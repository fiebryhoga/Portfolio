# Dockerfile for Laravel 12 Backend (PHP 8.4)
FROM php:8.4-cli-alpine

# Install system dependencies and PHP extensions for MySQL & Composer
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    mysql-client \
    oniguruma-dev \
    linux-headers \
    && docker-php-ext-install pdo pdo_mysql mbstring gd pcntl

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy application files
COPY . .

# Install production dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Create necessary directories and set permissions
RUN mkdir -p storage bootstrap/cache public/uploads \
    && chmod -R 775 storage bootstrap/cache public/uploads

EXPOSE 8080

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8080"]
