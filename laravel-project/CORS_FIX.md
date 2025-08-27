# CORS Middleware Fix

## Problem
The error "Target class [Fruitcake\Cors\HandleCors] does not exist" occurs because the CORS middleware is referenced in the HTTP Kernel but the required package is not installed.

## Solution

### Option 1: Install CORS Package (Recommended for API Development)

1. **Install the CORS package**:
   ```bash
   cd /home/z/my-project/laravel-project
   composer require fruitcake/laravel-cors
   ```

2. **Run the setup script** (which will install dependencies and run migrations):
   ```bash
   ./setup.sh
   ```

### Option 2: Remove CORS Middleware (If Not Needed)

If you don't need CORS support (e.g., for same-origin applications only), you can remove the middleware:

1. **Edit the HTTP Kernel**:
   ```bash
   nano app/Http/Kernel.php
   ```

2. **Remove this line** (around line 16):
   ```php
   \Fruitcake\Cors\HandleCors::class,
   ```

3. **Save the file and run migrations**:
   ```bash
   php artisan migrate
   ```

## What I've Fixed

### 1. **Added CORS Package to Composer**
- Added `"fruitcake/laravel-cors": "^3.0"` to `composer.json`

### 2. **Created CORS Configuration**
- Created `config/cors.php` with proper CORS settings
- Configured to allow all origins for development (you can restrict this in production)

### 3. **Updated Setup Script**
- The existing `setup.sh` script will now install the CORS package when running `composer install`

## CORS Configuration

The CORS configuration is set up with:
- **Paths**: `api/*` and `sanctum/csrf-cookie`
- **Methods**: All HTTP methods (`*`)
- **Origins**: All origins (`*`) - suitable for development
- **Headers**: All headers (`*`)
- **Credentials**: Disabled (`false`)

### Production Security Note

For production, you should restrict the CORS settings in `config/cors.php`:

```php
'allowed_origins' => [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
    'http://localhost:3000', // Your Next.js development server
],
```

## Next Steps

1. **Run the setup script**:
   ```bash
   cd /home/z/my-project/laravel-project
   ./setup.sh
   ```

2. **Or manually install dependencies**:
   ```bash
   composer install
   php artisan key:generate
   php artisan migrate
   ```

3. **Start the development server**:
   ```bash
   php artisan serve
   ```

The CORS middleware error should now be resolved, and your Laravel API will be ready to handle cross-origin requests from your Next.js frontend!