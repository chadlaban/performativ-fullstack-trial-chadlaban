<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Recipes>
 */
class RecipesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'ingredients' => $this->faker->paragraph(5),
            'instructions' => $this->faker->paragraphs(3),
            'user_id' => User::factory(), // Creates a new user and assigns it
            'category_id' => null,       // You can modify this if categories are mandatory
            'created_by' => $this->faker->name(),
            'created_at' => now(),
        ];
    }
}
