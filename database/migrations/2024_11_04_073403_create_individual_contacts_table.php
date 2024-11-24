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
        Schema::create('individual_contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('individual_profile_id')->index();
            $table->foreignId("contact_type_id")->index();
            $table->string("contact_value");
            $table->integer("sort");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('individual_contacts');
    }
};
