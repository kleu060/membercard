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
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('company')->nullable();
            $table->string('position')->nullable();
            $table->text('message')->nullable();
            $table->string('interest', 50)->default('general');
            $table->string('source', 50)->default('manual');
            $table->enum('status', ['new', 'contacted', 'qualified', 'proposal_sent', 'converted', 'lost'])->default('new'); // new, contacted, qualified, proposal_sent, converted, lost
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium'); // low, medium, high, urgent
            $table->integer('score')->default(0);
            $table->decimal('estimated_value', 12, 2)->nullable();
            $table->string('currency')->default('TWD');
            $table->string('website')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('twitter')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->text('tags')->nullable(); // JSON array of tags
            $table->text('notes')->nullable();
            $table->dateTime('last_contact_at')->nullable();
            $table->foreignId('business_card_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('assigned_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            $table->index(['user_id']);
            $table->index(['source']);
            $table->index(['score']);
            $table->index(['created_at']);
        });

        Schema::create('lead_interactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->constrained()->onDelete('cascade');
            $table->string('type', 20); // call, email, meeting, video, coffee, other
            $table->enum('direction', ['inbound', 'outbound']); // inbound, outbound
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('duration')->nullable(); // minutes
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->index(['lead_id']);
            $table->index(['user_id']);
            $table->index(['created_at']);
        });

        Schema::create('lead_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->constrained()->onDelete('cascade');
            $table->string('type', 30); // created, updated, status_changed, interaction_logged, etc.
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->index(['lead_id']);
            $table->index(['user_id']);
            $table->index(['created_at']);
        });

        Schema::create('lead_forms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_public')->default(true);
            $table->text('embed_code'); // HTML/JS embed code
            $table->text('fields'); // JSON array of form fields
            $table->timestamps();

            $table->index(['user_id']);
        });

        Schema::create('form_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_id')->constrained()->onDelete('cascade');
            $table->foreignId('lead_id')->nullable()->constrained()->onDelete('set null');
            $table->text('data'); // JSON form data
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();

            $table->index(['form_id']);
            $table->index(['lead_id']);
            $table->index(['created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_submissions');
        Schema::dropIfExists('lead_forms');
        Schema::dropIfExists('lead_activities');
        Schema::dropIfExists('lead_interactions');
        Schema::dropIfExists('leads');
    }
};