<?php

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/bootstrap/app.php';

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

try {
    // Check social_links table structure
    $columns = Schema::getColumnListing('social_links');
    echo "social_links table columns:\n";
    print_r($columns);
    
    echo "\n\n";
    
    // Check if business_card_id column exists
    if (in_array('business_card_id', $columns)) {
        echo "business_card_id column EXISTS in social_links table\n";
    } else {
        echo "business_card_id column does NOT exist in social_links table\n";
    }
    
    // Check if card_id column exists
    if (in_array('card_id', $columns)) {
        echo "card_id column EXISTS in social_links table\n";
    } else {
        echo "card_id column does NOT exist in social_links table\n";
    }
    
    echo "\n\n";
    
    // Check the actual schema
    $schema = DB::select("PRAGMA table_info(social_links)");
    echo "social_links table schema:\n";
    print_r($schema);
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}