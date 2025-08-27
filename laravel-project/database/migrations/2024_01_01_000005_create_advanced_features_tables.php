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
        // Active Directory Integration
        Schema::create('active_directory_configs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('domain', 100);
            $table->string('server_url', 191);
            $table->string('username', 100);
            $table->string('password', 255); // Note: In production, this should be encrypted
            $table->string('base_dn', 255);
            $table->string('user_filter', 255)->nullable();
            $table->integer('sync_interval')->default(3600);
            $table->boolean('is_active')->default(true);
            $table->dateTime('last_sync_at')->nullable();
            $table->timestamps();

            $table->index(['user_id']);
        });

        Schema::create('active_directory_sync_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('config_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['success', 'error', 'warning']);
            $table->text('message')->nullable();
            $table->integer('users_synced')->default(0);
            $table->integer('users_updated')->default(0);
            $table->integer('users_created')->default(0);
            $table->text('errors')->nullable(); // JSON array of errors
            $table->integer('duration')->nullable(); // milliseconds
            $table->timestamps();

            $table->index(['config_id']);
            $table->index(['created_at']);
        });

        // iPhone Sync Integration
        Schema::create('iphone_sync_configs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('card_dav_url', 191)->nullable()->unique();
            $table->string('username', 100)->nullable();
            $table->string('password', 255)->nullable(); // encrypted in production
            $table->integer('sync_interval')->default(3600);
            $table->boolean('is_active')->default(true);
            $table->dateTime('last_sync_at')->nullable();
            $table->string('sync_direction', 10)->default('both'); // "import", "export", "both"
            $table->boolean('auto_sync')->default(false);
            $table->timestamps();

            $table->index(['user_id']);
        });

        Schema::create('iphone_sync_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('config_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['success', 'error', 'warning']);
            $table->text('message')->nullable();
            $table->integer('contacts_synced')->default(0);
            $table->integer('contacts_created')->default(0);
            $table->integer('contacts_updated')->default(0);
            $table->text('errors')->nullable(); // JSON array of errors
            $table->integer('duration')->nullable(); // milliseconds
            $table->timestamps();

            $table->index(['config_id']);
            $table->index(['created_at']);
        });

        // Email Automation
        Schema::create('email_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name', 191);
            $table->string('subject', 191);
            $table->text('content'); // HTML content
            $table->string('type', 20)->default('campaign'); // campaign, automated, followup
            $table->string('category', 50)->nullable(); // welcome, followup, newsletter, promotion
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['user_id']);
            $table->index(['is_active']);
            $table->index(['type']);
        });

        Schema::create('email_campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('template_id')->constrained()->onDelete('cascade');
            $table->string('name', 191);
            $table->text('description')->nullable();
            $table->string('status', 20)->default('draft'); // draft, scheduled, active, paused, completed
            $table->string('schedule_type', 20)->default('immediate'); // immediate, scheduled, recurring
            $table->dateTime('scheduled_at')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->text('target_segment')->nullable(); // JSON segment criteria
            $table->integer('sent_count')->default(0);
            $table->integer('delivered_count')->default(0);
            $table->integer('opened_count')->default(0);
            $table->integer('clicked_count')->default(0);
            $table->timestamps();

            $table->index(['user_id']);
            $table->index(['schedule_type']);
            $table->index(['created_at']);
        });

        Schema::create('email_automations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('template_id')->constrained()->onDelete('cascade');
            $table->string('name', 191);
            $table->text('description')->nullable();
            $table->string('trigger_type', 50); // time_based, action_based, behavior_based
            $table->text('trigger_config'); // JSON trigger configuration
            $table->boolean('is_active')->default(true);
            $table->dateTime('last_run_at')->nullable();
            $table->dateTime('next_run_at')->nullable();
            $table->integer('run_count')->default(0);
            $table->timestamps();

            $table->index(['user_id']);
            $table->index(['trigger_type']);
            $table->index(['is_active']);
        });

        Schema::create('email_deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('lead_id')->constrained()->onDelete('cascade');
            $table->string('email', 191);
            $table->string('subject', 191);
            $table->string('status', 20)->default('pending'); // pending, sent, delivered, opened, clicked, bounced, failed
            $table->dateTime('sent_at')->nullable();
            $table->dateTime('delivered_at')->nullable();
            $table->dateTime('opened_at')->nullable();
            $table->dateTime('clicked_at')->nullable();
            $table->dateTime('bounced_at')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamps();

            $table->index(['campaign_id']);
            $table->index(['lead_id']);
            $table->index(['sent_at']);
        });

        // Advanced Segmentation
        Schema::create('lead_segments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name', 191);
            $table->text('description')->nullable();
            $table->text('criteria'); // JSON segment criteria
            $table->boolean('is_active')->default(true);
            $table->boolean('is_dynamic')->default(true); // true for dynamic, false for static
            $table->integer('lead_count')->default(0);
            $table->timestamps();

            $table->index(['user_id']);
            $table->index(['is_active']);
            $table->index(['is_dynamic']);
        });

        Schema::create('lead_segment_memberships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('segment_id')->constrained()->onDelete('cascade');
            $table->foreignId('lead_id')->constrained()->onDelete('cascade');
            $table->dateTime('added_at')->default(now());

            $table->unique(['segment_id', 'lead_id']);
            $table->index(['segment_id']);
            $table->index(['lead_id']);
        });

        // Team Collaboration
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->string('name', 191);
            $table->text('description')->nullable();
            $table->foreignId('leader_id')->constrained()->onDelete('cascade');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['leader_id']);
            $table->index(['is_active']);
        });

        Schema::create('team_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('role', 20)->default('member'); // leader, admin, member
            $table->dateTime('joined_at')->default(now());

            $table->unique(['team_id', 'user_id']);
            $table->index(['team_id']);
            $table->index(['user_id']);
        });

        Schema::create('lead_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->constrained()->onDelete('cascade');
            $table->foreignId('team_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('assigned_by')->constrained('users')->onDelete('cascade');
            $table->dateTime('assigned_at')->default(now());
            $table->enum('status', ['active', 'reassigned', 'completed'])->default('active');
            $table->text('notes')->nullable();

            $table->index(['lead_id']);
            $table->index(['team_id']);
            $table->index(['user_id']);
        });

        Schema::create('team_collaborations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->constrained()->onDelete('cascade');
            $table->foreignId('team_id')->constrained()->onDelete('cascade');
            $table->string('type', 20); // comment, mention, update, reminder
            $table->text('content');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('mentioned_users')->nullable(); // JSON array of mentioned user IDs
            $table->boolean('is_read')->default(false);
            $table->timestamps();

            $table->index(['lead_id']);
            $table->index(['team_id']);
            $table->index(['user_id']);
            $table->index(['is_read']);
        });

        // Mobile Optimization
        Schema::create('mobile_devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('device_type', 20); // ios, android, web
            $table->string('device_token', 255)->nullable();
            $table->boolean('is_active')->default(true);
            $table->dateTime('last_seen_at')->nullable();
            $table->timestamps();

            $table->index(['user_id']);
            $table->index(['device_type']);
            $table->index(['is_active']);
        });

        Schema::create('push_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('device_id')->nullable()->constrained()->onDelete('set null');
            $table->string('type', 50); // lead_update, assignment, reminder, campaign
            $table->string('title', 191);
            $table->text('message');
            $table->text('data')->nullable(); // JSON additional data
            $table->enum('status', ['pending', 'sent', 'delivered', 'read'])->default('pending');
            $table->dateTime('sent_at')->nullable();
            $table->dateTime('delivered_at')->nullable();
            $table->dateTime('read_at')->nullable();
            $table->timestamps();

            $table->index(['user_id']);
            $table->index(['device_id']);
            $table->index(['created_at']);
        });

        Schema::create('offline_syncs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('device_type', 20);
            $table->string('entity_type', 20); // lead, activity, interaction
            $table->string('entity_id', 50);
            $table->string('action', 20); // create, update, delete
            $table->text('data'); // JSON entity data
            $table->enum('status', ['pending', 'synced', 'failed'])->default('pending');
            $table->dateTime('synced_at')->nullable();
            $table->timestamps();

            $table->index(['user_id']);
            $table->index(['device_type']);
            $table->index(['created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offline_syncs');
        Schema::dropIfExists('push_notifications');
        Schema::dropIfExists('mobile_devices');
        Schema::dropIfExists('team_collaborations');
        Schema::dropIfExists('lead_assignments');
        Schema::dropIfExists('team_members');
        Schema::dropIfExists('teams');
        Schema::dropIfExists('lead_segment_memberships');
        Schema::dropIfExists('lead_segments');
        Schema::dropIfExists('email_deliveries');
        Schema::dropIfExists('email_automations');
        Schema::dropIfExists('email_campaigns');
        Schema::dropIfExists('email_templates');
        Schema::dropIfExists('iphone_sync_logs');
        Schema::dropIfExists('iphone_sync_configs');
        Schema::dropIfExists('active_directory_sync_logs');
        Schema::dropIfExists('active_directory_configs');
    }
};