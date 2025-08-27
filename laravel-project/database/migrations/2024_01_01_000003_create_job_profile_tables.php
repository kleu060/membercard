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
        Schema::create('job_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->text('summary')->nullable();
            $table->string('resume_url', 500)->nullable();
            $table->timestamps();
            
            $table->index(['user_id']);
        });

        Schema::create('career_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained('job_profiles')->onDelete('cascade');
            $table->string('title', 191);
            $table->string('company', 191);
            $table->dateTime('start_date');
            $table->dateTime('end_date')->nullable();
            $table->boolean('is_current')->default(false);
            $table->text('description')->nullable();
            $table->timestamps();
            
            $table->index(['profile_id']);
        });

        Schema::create('education', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained('job_profiles')->onDelete('cascade');
            $table->string('institution', 191);
            $table->string('degree', 191);
            $table->string('field', 191)->nullable();
            $table->dateTime('start_date');
            $table->dateTime('end_date')->nullable();
            $table->boolean('is_current')->default(false);
            $table->decimal('gpa', 3, 2)->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
            
            $table->index(['profile_id']);
        });

        Schema::create('certifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained('job_profiles')->onDelete('cascade');
            $table->string('name', 191);
            $table->string('issuer', 191);
            $table->dateTime('issue_date')->nullable();
            $table->dateTime('expiry_date')->nullable();
            $table->string('credential_number', 100)->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
            
            $table->index(['profile_id']);
        });

        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained('job_profiles')->onDelete('cascade');
            $table->string('name', 100);
            $table->string('level', 20)->nullable(); // 'beginner', 'intermediate', 'advanced', 'expert'
            $table->integer('years_experience')->nullable();
            $table->timestamps();
            
            $table->index(['profile_id']);
            $table->unique(['profile_id', 'name']);
        });

        Schema::create('saved_searches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained('job_profiles')->onDelete('cascade');
            $table->string('name', 191);
            $table->string('keywords', 191)->nullable();
            $table->string('industry', 100)->nullable();
            $table->string('location', 191)->nullable();
            $table->string('job_type', 50)->nullable();
            $table->string('remote_option', 50)->nullable();
            $table->string('salary_range', 50)->nullable();
            $table->timestamps();
            
            $table->index(['profile_id']);
        });

        Schema::create('saved_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained('job_profiles')->onDelete('cascade');
            $table->string('job_id', 50); // Foreign key to jobs table
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['profile_id']);
            $table->unique(['profile_id', 'job_id']);
        });

        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained('job_profiles')->onDelete('cascade');
            $table->string('job_id', 50); // Foreign key to jobs table
            $table->string('status', 20); // 'applied', 'interviewing', 'rejected', 'offered', 'accepted', 'declined'
            $table->text('notes')->nullable();
            $table->dateTime('applied_at')->default(now());
            $table->timestamps();
            
            $table->index(['profile_id']);
            $table->index(['job_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
        Schema::dropIfExists('saved_jobs');
        Schema::dropIfExists('saved_searches');
        Schema::dropIfExists('skills');
        Schema::dropIfExists('certifications');
        Schema::dropIfExists('education');
        Schema::dropIfExists('career_histories');
        Schema::dropIfExists('job_profiles');
    }
};