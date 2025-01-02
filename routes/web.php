<?php

use App\Models\Recipes;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RecipesController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $recipes = Recipes::all();

    return Inertia::render('LandingPage', [
        'recipes' => $recipes,
    ]);
});

Route::get('recipes/search/{query}/{category?}', [RecipesController::class, 'show']); // category is optional

require __DIR__.'/auth.php';
