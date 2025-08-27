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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('card_id')->constrained('business_cards')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title', 191);
            $table->text('description')->nullable();
            $table->dateTime('appointment_date');
            $table->integer('duration')->default(30);
            $table->string('status', 50)->default('pending');
            $table->string('contact_name', 191);
            $table->string('contact_email', 191)->nullable();
            $table->string('contact_phone', 50)->nullable();
            $table->text('notes')->nullable();
            $table->string('calendar_event_id', 191)->nullable();
            $table->foreignId('calendar_integration_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
            
            $table->index(['card_id']);
            $table->index(['user_id']);
            $table->index(['appointment_date']);
            $table->index(['calendar_integration_id']);
        });

        Schema::create('appointment_availabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('card_id')->constrained('business_cards')->onDelete('cascade');
            $table->integer('day_of_week'); // 0-6 (Sunday-Saturday)
            $table->string('start_time', 5); // HH:mm format
            $table->string('end_time', 5); // HH:mm format
            $table->boolean('is_available')->default(true);
            $table->integer('max_appointments')->default(1);
            $table->integer('buffer_time')->default(0);
            $table->timestamps();
            
            $table->index(['card_id']);
            $table->index(['day_of_week']);
            $table->unique(['card_id', 'day_of_week', 'start_time']);
        });

        Schema::create('calendar_integrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('provider', 50); // 'google', 'outlook', 'apple'
            $table->string('access_token');
            $table->string('refresh_token')->nullable();
            $table->dateTime('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('calendar_id', 191)->nullable();
            $table->timestamps();
            
            $table->index(['user_id']);
            $table->index(['provider']);
        });

        Schema::create('booking_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->string('location_type', 20); // 'in-person', 'online', 'both'
            $table->text('location_address')->nullable();
            $table->string('online_meeting_link', 500)->nullable();
            $table->decimal('base_price', 10, 2)->default(0);
            $table->string('currency', 3)->default('TWD');
            $table->integer('duration')->default(60);
            $table->integer('max_advance_days')->default(30);
            $table->integer('min_advance_hours')->default(2);
            $table->text('cancellation_policy')->nullable();
            $table->string('lunch_break_start', 5)->nullable();
            $table->string('lunch_break_end', 5)->nullable();
            
            // Working hours fields
            $table->boolean('mon_enabled')->default(true);
            $table->string('mon_start', 5)->default('09:00');
            $table->string('mon_end', 5)->default('18:00');
            $table->boolean('tue_enabled')->default(true);
            $table->string('tue_start', 5)->default('09:00');
            $table->string('tue_end', 5)->default('18:00');
            $table->boolean('wed_enabled')->default(true);
            $table->string('wed_start', 5)->default('09:00');
            $table->string('wed_end', 5)->default('18:00');
            $table->boolean('thu_enabled')->default(true);
            $table->string('thu_start', 5)->default('09:00');
            $table->string('thu_end', 5)->default('18:00');
            $table->boolean('fri_enabled')->default(true);
            $table->string('fri_start', 5)->default('09:00');
            $table->string('fri_end', 5)->default('18:00');
            $table->boolean('sat_enabled')->default(false);
            $table->string('sat_start', 5)->default('09:00');
            $table->string('sat_end', 5)->default('18:00');
            $table->boolean('sun_enabled')->default(false);
            $table->string('sun_start', 5)->default('09:00');
            $table->string('sun_end', 5)->default('18:00');
            
            $table->timestamps();
            
            $table->index(['user_id']);
        });

        Schema::create('time_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_settings_id')->constrained()->onDelete('cascade');
            $table->integer('day_of_week'); // 0-6 (Sunday-Saturday)
            $table->string('start_time', 5); // HH:mm format
            $table->string('end_time', 5); // HH:mm format
            $table->boolean('is_available')->default(true);
            $table->integer('max_bookings')->default(1);
            $table->timestamps();
            
            $table->index(['booking_settings_id']);
            $table->index(['day_of_week']);
            $table->unique(['booking_settings_id', 'day_of_week', 'start_time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('time_slots');
        Schema::dropIfExists('booking_settings');
        Schema::dropIfExists('calendar_integrations');
        Schema::dropIfExists('appointment_availabilities');
        Schema::dropIfExists('appointments');
    }
};