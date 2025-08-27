#!/bin/bash

# Laravel Project Setup Script
# This script will set up the Laravel project with all necessary dependencies

echo "Setting up Laravel project..."

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "Error: PHP is not installed. Please install PHP first."
    exit 1
fi

# Check if Composer is installed
if ! command -v composer &> /dev/null; then
    echo "Installing Composer..."
    curl -sS https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer
fi

# Navigate to Laravel project directory
cd /home/z/my-project/laravel-project

# Install Laravel dependencies
echo "Installing Laravel dependencies..."
composer install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

# Generate application key
echo "Generating application key..."
php artisan key:generate

# Create database file for SQLite
if [ ! -f database/database.sqlite ]; then
    echo "Creating SQLite database..."
    mkdir -p database
    touch database/database.sqlite
fi

# Run migrations
echo "Running database migrations..."
php artisan migrate

# Link storage directory
echo "Linking storage directory..."
php artisan storage:link

# Set proper permissions
echo "Setting proper permissions..."
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

echo "Laravel project setup complete!"
echo "You can now run: php artisan serve"