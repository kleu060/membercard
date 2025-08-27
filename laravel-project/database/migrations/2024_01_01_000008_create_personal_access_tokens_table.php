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
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->string('name', 191);
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->morphs('tokenable');
            $table->timestamps();
            
            $table->index(['token']);
            $table->index(['tokenable_type']);
            $table->index(['tokenable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
    }
};