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

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');

    Route::get('/recipes', [RecipesController::class, 'index'])->name('recipes.index');
    Route::post('/api/add_recipe', [RecipesController::class, 'store']);
    Route::put('/api/edit_recipe/{id}', [RecipesController::class, 'edit']);

    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });
});

require __DIR__.'/auth.php';
