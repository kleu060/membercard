# Laravel Project Setup Guide

This Laravel project has been reconstructed with all the necessary files and structure. Follow the instructions below to set it up properly.

## Prerequisites

Before setting up the Laravel project, ensure you have the following installed:

- PHP 8.2 or higher
- Composer
- SQLite (or other database of your choice)
- Web server (Apache, Nginx, etc.)

## Quick Setup

### Option 1: Using the Setup Script (Recommended)

1. Navigate to the Laravel project directory:
   ```bash
   cd /home/z/my-project/laravel-project
   ```

2. Run the setup script:
   ```bash
   ./setup.sh
   ```

   The script will automatically:
   - Check for PHP and Composer installation
   - Install Composer if needed
   - Install Laravel dependencies
   - Create .env file
   - Generate application key
   - Create SQLite database
   - Run migrations
   - Link storage directory
   - Set proper permissions

### Option 2: Manual Setup

1. **Install Dependencies:**
   ```bash
   cd /home/z/my-project/laravel-project
   composer install
   ```

2. **Create Environment File:**
   ```bash
   cp .env.example .env
   ```

3. **Generate Application Key:**
   ```bash
   php artisan key:generate
   ```

4. **Set Up Database:**
   
   For SQLite (default):
   ```bash
   mkdir -p database
   touch database/database.sqlite
   ```
   
   Or configure your database in `.env` file for MySQL/PostgreSQL.

5. **Run Migrations:**
   ```bash
   php artisan migrate
   ```

6. **Link Storage Directory:**
   ```bash
   php artisan storage:link
   ```

7. **Set Permissions:**
   ```bash
   sudo chown -R www-data:www-data storage bootstrap/cache
   sudo chmod -R 775 storage bootstrap/cache
   ```

## Project Structure

The Laravel project has been reconstructed with the following structure:

```
laravel-project/
├── app/
│   ├── Console/
│   │   └── Kernel.php
│   ├── Exceptions/
│   │   └── Handler.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   ├── Kernel.php
│   │   └── Middleware/
│   ├── Models/
│   │   ├── User.php
│   │   ├── BusinessCard.php
│   │   ├── JobProfile.php
│   │   └── ... (other models)
│   └── Providers/
├── bootstrap/
│   └── app.php
├── config/
│   ├── app.php
│   ├── database.php
│   └── ... (other config files)
├── database/
│   ├── migrations/
│   │   ├── 2024_01_01_000001_create_core_tables.php
│   │   ├── 2024_01_01_000002_create_appointment_tables.php
│   │   ├── 2024_01_01_000003_create_job_profile_tables.php
│   │   ├── 2024_01_01_000004_create_crm_tables.php
│   │   └── 2024_01_01_000005_create_advanced_features_tables.php
│   └── ... (database files)
├── public/
│   └── index.php
├── resources/
│   ├── lang/
│   │   └── en/
│   └── views/
│       ├── layouts/
│       ├── marketplace/
│       ├── dashboard/
│       └── welcome.blade.php
├── routes/
│   ├── api.php
│   ├── channels.php
│   ├── console.php
│   └── web.php
├── storage/
│   ├── framework/
│   └── logs/
├── tests/
├── vendor/ (created after composer install)
├── .env.example
├── .gitignore
├── artisan
├── composer.json
└── setup.sh
```

## Available Artisan Commands

The project includes the standard Laravel artisan commands. Some useful ones:

```bash
# Serve the application
php artisan serve

# Run migrations
php artisan migrate

# Create new migration
php artisan make:migration create_table_name

# Create new controller
php artisan make:controller ControllerName

# Create new model
php artisan make:model ModelName

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Check routes
php artisan route:list
```

## Configuration

### Environment Variables

Edit the `.env` file to configure your application:

```env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=your_generated_key_here
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=sqlite
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=root
# DB_PASSWORD=
```

### Database Configuration

The project is configured to use SQLite by default. To use MySQL or PostgreSQL:

1. Update the `.env` file with your database credentials
2. Ensure the database exists
3. Run `php artisan migrate`

## API Routes

The project includes the following API routes:

- `/api/auth/register` - User registration
- `/api/auth/login` - User login
- `/api/auth/logout` - User logout
- `/api/auth/me` - Get current user
- `/api/cards` - Business card CRUD operations
- `/api/user/job-profile` - Job profile operations
- `/api/appointments` - Appointment management
- `/api/marketplace` - Marketplace data
- `/api/admin/*` - Admin-only routes

## Troubleshooting

### Common Issues

1. **"Class not found" errors**
   - Run `composer install` to install dependencies
   - Run `composer dump-autoload` to regenerate autoload files

2. **Database connection errors**
   - Check your `.env` file database configuration
   - Ensure the database exists and credentials are correct
   - Run `php artisan migrate` to create tables

3. **Permission errors**
   - Set proper permissions on storage and bootstrap/cache directories
   - Ensure web server has write access to storage directory

4. **"No application encryption key" error**
   - Run `php artisan key:generate`

### Getting Help

If you encounter issues:

1. Check the Laravel documentation: https://laravel.com/docs
2. Check error logs in `storage/logs/laravel.log`
3. Enable debug mode in `.env` file (`APP_DEBUG=true`)

## Development

### Adding New Features

1. Create new models, controllers, and migrations using artisan commands
2. Add routes to `routes/api.php` or `routes/web.php`
3. Update database schema and run migrations
4. Test your changes

### Testing

```bash
# Run tests
php artisan test

# Run specific test
php artisan test --filter=TestName
```

## Deployment

For production deployment:

1. Set `APP_ENV=production` and `APP_DEBUG=false` in `.env`
2. Optimize the application:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```
3. Set up proper web server configuration
4. Ensure proper file permissions
5. Set up a proper database (not SQLite for production)

## Security

- Always keep dependencies updated
- Use environment variables for sensitive data
- Implement proper authentication and authorization
- Validate and sanitize user input
- Use HTTPS in production
- Keep Laravel framework updated

---

This Laravel project is now ready for development and deployment!