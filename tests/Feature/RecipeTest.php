<?php

use App\Models\User;
use App\Models\Categories;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

test('user can create a recipe', function () {
    $user = User::factory()->create();

    DB::table('categories')->insert(['id' => 1, 'name' => 'Test Category']);

    $recipeData = [
        'name' => 'Test Recipe',
        'description' => 'A test recipe description',
        'ingredients' => ['flour', 'sugar', 'eggs'],
        'instructions' => ['Mix ingredients', 'Bake at 350°F', 'Cool and serve'],
        'category_id' => 1,
    ];

    $response = $this->actingAs($user)
        ->postJson('/api/add_recipe', $recipeData);

    $response->assertStatus(201);
    $response->assertJsonFragment(['message' => 'Recipe created successfully!']);

    $this->assertDatabaseHas('recipes', [
        'name' => 'Test Recipe',
        'description' => 'A test recipe description',
        'user_id' => $user->id,
    ]);
});

test('user cannot create a recipe - Unauthorized', function () {
    $recipeData = [
        'name' => 'Unauthorized Recipe',
        'description' => 'This should not be created',
        'ingredients' => ['flour', 'sugar', 'eggs'],
        'instructions' => ['Mix ingredients', 'Bake at 350°F', 'Cool and serve'],
        'category_id' => 1,
    ];

    $response = $this->postJson('/api/add_recipe', $recipeData);

    $response->assertStatus(401);
    $response->assertJsonFragment(['message' => 'Unauthenticated.']);

    $this->assertDatabaseMissing('recipes', [
        'name' => 'Unauthorized Recipe',
    ]);
});
