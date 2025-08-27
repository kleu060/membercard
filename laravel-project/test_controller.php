<?php

// Simple test to verify the Controller class exists and can be imported
require_once 'vendor/autoload.php';

try {
    // Test if we can import the Controller class
    $controllerClass = new \App\Http\Controllers\Controller();
    echo "✅ Controller class loaded successfully!\n";
    
    // Test if we can import the HomeController
    $homeController = new \App\Http\Controllers\Web\HomeController();
    echo "✅ HomeController loaded successfully!\n";
    
    // Test if we can import the DashboardController
    $dashboardController = new \App\Http\Controllers\Web\DashboardController();
    echo "✅ DashboardController loaded successfully!\n";
    
    echo "\n🎉 All controller imports are working correctly!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}