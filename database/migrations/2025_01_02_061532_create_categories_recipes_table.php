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
        Schema::create('categories_recipes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('categories_id')
                ->constrained('categories')
                ->cascadeOnDeleted();
            $table->foreignId('recipes_id')
                ->constrained('recipes')
                ->cascadeOnDeleted();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories_recipes');
    }
};
