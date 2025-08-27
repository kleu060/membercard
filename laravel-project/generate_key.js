#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Generate a Laravel application key
const key = 'base64:' + crypto.randomBytes(32).toString('base64');

console.log('Generated key:', key);

// Update the .env file
const envFile = path.join(__dirname, '.env');
let envContent;

try {
  envContent = fs.readFileSync(envFile, 'utf8');
} catch (err) {
  console.error('Error reading .env file:', err);
  process.exit(1);
}

// Replace APP_KEY= with the generated key
envContent = envContent.replace(/^APP_KEY=.*$/m, 'APP_KEY=' + key);

try {
  fs.writeFileSync(envFile, envContent);
  console.log('Key has been written to .env file');
  console.log('Please run: php artisan config:clear (when PHP is available)');
} catch (err) {
  console.error('Error writing to .env file:', err);
  process.exit(1);
}