<?php
/**
 * Test script to verify Laravel structure
 * 
 * This script checks if all essential Laravel files and directories exist.
 * Run this script after setting up the project to verify everything is in place.
 */

$requiredFiles = [
    'artisan',
    'bootstrap/app.php',
    'composer.json',
    '.env.example',
    'public/index.php',
    'routes/web.php',
    'routes/api.php',
    'config/app.php',
    'config/database.php',
    'app/Http/Kernel.php',
    'app/Exceptions/Handler.php',
    'app/Console/Kernel.php',
    'app/Models/User.php',
    'app/Http/Controllers/Api/AuthController.php',
    'resources/views/welcome.blade.php',
    '.gitignore'
];

$requiredDirectories = [
    'app',
    'bootstrap',
    'config',
    'database',
    'public',
    'resources',
    'routes',
    'storage',
    'tests',
    'vendor'
];

echo "Laravel Project Structure Verification\n";
echo "=====================================\n\n";

$missingFiles = [];
$missingDirectories = [];

// Check files
foreach ($requiredFiles as $file) {
    if (file_exists($file)) {
        echo "✓ $file\n";
    } else {
        echo "✗ $file (MISSING)\n";
        $missingFiles[] = $file;
    }
}

echo "\n";

// Check directories
foreach ($requiredDirectories as $dir) {
    if (is_dir($dir)) {
        echo "✓ $dir/\n";
    } else {
        echo "✗ $dir/ (MISSING)\n";
        $missingDirectories[] = $dir;
    }
}

echo "\n";

if (empty($missingFiles) && empty($missingDirectories)) {
    echo "🎉 All required files and directories are present!\n";
    echo "Your Laravel project structure is complete.\n";
} else {
    echo "❌ Missing files/directories detected:\n";
    
    if (!empty($missingFiles)) {
        echo "\nMissing files:\n";
        foreach ($missingFiles as $file) {
            echo "  - $file\n";
        }
    }
    
    if (!empty($missingDirectories)) {
        echo "\nMissing directories:\n";
        foreach ($missingDirectories as $dir) {
            echo "  - $dir/\n";
        }
    }
    
    echo "\nPlease create the missing files and directories.\n";
}

echo "\nNext steps:\n";
echo "1. Run 'composer install' to install dependencies\n";
echo "2. Copy '.env.example' to '.env' and configure\n";
echo "3. Run 'php artisan key:generate'\n";
echo "4. Set up your database and run 'php artisan migrate'\n";
echo "5. Run 'php artisan serve' to start the development server\n";

?>