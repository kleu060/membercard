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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('email', 191)->unique();
            $table->string('name', 191)->nullable();
            $table->string('password', 191)->nullable();
            $table->string('avatar', 191)->nullable();
            $table->string('location', 191)->nullable();
            $table->string('role', 50)->default('user');
            $table->string('subscription_plan', 50)->default('free');
            $table->timestamps();
        });

        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('type', 50);
            $table->string('provider', 50);
            $table->string('provider_account_id', 150);
            $table->string('refresh_token')->nullable();
            $table->string('access_token')->nullable();
            $table->integer('expires_at')->nullable();
            $table->string('token_type')->nullable();
            $table->string('scope')->nullable();
            $table->string('id_token')->nullable();
            $table->string('session_state')->nullable();
            $table->unique(['provider', 'provider_account_id']);
            $table->timestamps();
        });

        Schema::create('business_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('company')->nullable();
            $table->string('position')->nullable();
            $table->string('phone')->nullable();
            $table->string('office_phone')->nullable();
            $table->string('email')->nullable();
            $table->string('address')->nullable();
            $table->string('website')->nullable();
            $table->text('bio')->nullable();
            $table->string('avatar')->nullable();
            $table->string('location')->nullable();
            $table->string('template')->default('modern-blue');
            $table->boolean('is_public')->default(true);
            $table->integer('view_count')->default(0);
            $table->timestamps();
            
            $table->index(['user_id']);
        });

        Schema::create('social_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('card_id')->constrained('business_cards')->onDelete('cascade');
            $table->string('platform');
            $table->string('url');
            $table->string('username')->nullable();
            $table->timestamps();
            
            $table->index(['card_id']);
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('card_id')->constrained('business_cards')->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
            
            $table->index(['card_id']);
        });

        Schema::create('product_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('url');
            $table->timestamps();
            
            $table->index(['product_id']);
        });

        Schema::create('product_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('url');
            $table->timestamps();
            
            $table->index(['product_id']);
        });

        Schema::create('industry_tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('card_id')->constrained('business_cards')->onDelete('cascade');
            $table->string('tag', 100);
            $table->timestamps();
            
            $table->index(['card_id']);
            $table->unique(['card_id', 'tag']);
        });

        Schema::create('saved_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('card_id')->constrained('business_cards')->onDelete('cascade');
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->unique(['user_id', 'card_id']);
            $table->index(['user_id']);
            $table->index(['card_id']);
        });

        Schema::create('scanned_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('image_url');
            $table->string('name')->nullable();
            $table->string('company')->nullable();
            $table->string('title')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('website')->nullable();
            $table->text('notes')->nullable();
            $table->text('ocr_data'); // JSON data from OCR
            $table->text('tags'); // JSON array of tags
            $table->timestamps();
            
            $table->index(['user_id']);
            $table->index(['created_at']);
        });

        Schema::create('contact_tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('saved_card_id')->constrained()->onDelete('cascade');
            $table->string('tag', 50);
            $table->string('color', 7)->default('3B82F6');
            $table->timestamps();
            
            $table->index(['saved_card_id']);
            $table->unique(['saved_card_id', 'tag']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_tags');
        Schema::dropIfExists('scanned_cards');
        Schema::dropIfExists('saved_cards');
        Schema::dropIfExists('industry_tags');
        Schema::dropIfExists('product_links');
        Schema::dropIfExists('product_photos');
        Schema::dropIfExists('products');
        Schema::dropIfExists('social_links');
        Schema::dropIfExists('business_cards');
        Schema::dropIfExists('accounts');
        Schema::dropIfExists('users');
    }
};