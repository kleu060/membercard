<?php

// Generate a Laravel application key
$key = 'base64:' . base64_encode(random_bytes(32));

echo "Generated key: " . $key . "\n";

// Update the .env file
$envFile = __DIR__ . '/.env';
$envContent = file_get_contents($envFile);

// Replace APP_KEY= with the generated key
$envContent = preg_replace('/^APP_KEY=.*$/m', 'APP_KEY=' . $key, $envContent);

file_put_contents($envFile, $envContent);

echo "Key has been written to .env file\n";
echo "Please run: php artisan config:clear\n";