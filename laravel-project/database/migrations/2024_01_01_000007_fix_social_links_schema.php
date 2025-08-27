<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Check if social_links table exists and has the correct structure
        if (Schema::hasTable('social_links')) {
            // Check if business_card_id column exists (incorrect column)
            if (Schema::hasColumn('social_links', 'business_card_id')) {
                // Drop the incorrect column if it exists
                Schema::table('social_links', function (Blueprint $table) {
                    $table->dropForeign(['business_card_id']);
                    $table->dropColumn('business_card_id');
                });
            }
            
            // Check if card_id column exists (correct column)
            if (!Schema::hasColumn('social_links', 'card_id')) {
                // Add the correct column if it doesn't exist
                Schema::table('social_links', function (Blueprint $table) {
                    $table->foreignId('card_id')->after('id')->constrained('business_cards')->onDelete('cascade');
                });
            }
            
            // Ensure all required columns exist
            if (!Schema::hasColumn('social_links', 'platform')) {
                Schema::table('social_links', function (Blueprint $table) {
                    $table->string('platform')->after('card_id');
                });
            }
            
            if (!Schema::hasColumn('social_links', 'url')) {
                Schema::table('social_links', function (Blueprint $table) {
                    $table->string('url')->after('platform');
                });
            }
            
            if (!Schema::hasColumn('social_links', 'username')) {
                Schema::table('social_links', function (Blueprint $table) {
                    $table->string('username')->nullable()->after('url');
                });
            }
            
            // Add indexes if they don't exist
            $indexes = Schema::getIndexListing('social_links');
            if (!in_array('social_links_card_id_index', $indexes)) {
                Schema::table('social_links', function (Blueprint $table) {
                    $table->index(['card_id']);
                });
            }
        } else {
            // Create the table if it doesn't exist
            Schema::create('social_links', function (Blueprint $table) {
                $table->id();
                $table->foreignId('card_id')->constrained('business_cards')->onDelete('cascade');
                $table->string('platform');
                $table->string('url');
                $table->string('username')->nullable();
                $table->timestamps();
                
                $table->index(['card_id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_links');
    }
};