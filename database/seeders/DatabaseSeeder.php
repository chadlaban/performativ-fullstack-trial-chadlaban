<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Categories;
use App\Models\Recipes;
use App\Enum\RolesEnum;
use App\Enum\PermissionsEnum;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // seed for user roles & permissions
        Role::truncate();
        Permission::truncate();

        $guestRole = Role::create(['name' => RolesEnum::Guest->value]);
        $adminRole = Role::create(['name' => RolesEnum::Admin->value]);
        $userRole = Role::create(['name' => RolesEnum::User->value]);

        $manageRecipesPermission = Permission::create([
            'name' => PermissionsEnum::ManageRecipes->value,
        ]);

        $manageUsersPermission = Permission::create([
            'name' => PermissionsEnum::ManageUsers->value,
        ]);

        $userRole->syncPermissions([$manageRecipesPermission]);
        $adminRole->syncPermissions([
            $manageRecipesPermission,
            $manageUsersPermission,
        ]);

        // create users
        $guest = User::create([
            'name' => 'Guest User',
            'email' => 'guest@example.com',
            'password' => bcrypt('performativ1234'),
        ])->assignRole(RolesEnum::Guest);

        $user1 = User::create([
            'name' => 'Chad Doe',
            'email' => 'user1@example.com',
            'password' => bcrypt('performativ1234u1'),
        ])->assignRole(RolesEnum::User);

        $user2 = User::create([
            'name' => 'John Doe',
            'email' => 'user2@example.com',
            'password' => bcrypt('performativ1234u2'),
        ])->assignRole(RolesEnum::User);

        $user3 = User::create([
            'name' => 'Jane Doe',
            'email' => 'user3@example.com',
            'password' => bcrypt('performativ1234u3'),
        ])->assignRole(RolesEnum::User);

        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('performativAdmin1234'),
        ])->assignRole(RolesEnum::Admin);

        // create categories
        Categories::truncate();

        $categories = [
            'Breakfast',
            'Brunch',
            'Lunch',
            'Dinner',
            'Pre-workout',
            'Post-workout',
            'Snacks'
        ];

        foreach ($categories as $category) {
            Categories::create(['name' => $category]);
        }

        // create Recipes for each user -> 2 unique recipes per user
        $faker = Faker::create();

        foreach ([['user' => $user1],
          ['user' => $user2],
          ['user' => $user3]] as $data) {
            $user = $data['user'];

            // recipes for each user
            $recipes = match ($user->id) {
                $user1->id => [
                    [
                        'name' => 'Spicy Chicken Tacos',
                        'description' => 'Delicious tacos with spicy marinated chicken, fresh salsa, and guacamole.',
                        'ingredients' => ['chicken', 'taco shells', 'jalapenos', 'avocado', 'tomato', 'onion', 'cilantro'],
                        'instructions' => [
                            'Marinate the chicken with spices and grill it.',
                            'Prepare salsa and guacamole with fresh ingredients.',
                            'Assemble tacos with grilled chicken, salsa, and guacamole.',
                            'Serve with a side of chips and lime wedges.',
                        ]
                    ],
                    [
                        'name' => 'Avocado Toast with Eggs',
                        'description' => 'A quick and healthy breakfast with creamy avocado, perfectly cooked eggs, and a touch of spice.',
                        'ingredients' => ['avocado', 'bread', 'eggs', 'chili flakes', 'salt', 'pepper'],
                        'instructions' => [
                            'Toast the bread slices.',
                            'Mash avocado with salt, pepper, and chili flakes.',
                            'Spread avocado on toast and top with a fried or poached egg.',
                            'Serve immediately with a sprinkle of chili flakes.',
                        ]
                    ]
                ],

                $user2->id => [
                    [
                        'name' => 'Grilled Salmon with Asparagus',
                        'description' => 'A light yet flavorful dish with perfectly grilled salmon and roasted asparagus.',
                        'ingredients' => ['salmon fillets', 'asparagus', 'lemon', 'olive oil', 'garlic', 'parsley'],
                        'instructions' => [
                            'Season the salmon with lemon juice, olive oil, and garlic.',
                            'Grill the salmon for 6-8 minutes per side.',
                            'Roast asparagus with olive oil and garlic.',
                            'Serve together with a sprinkle of fresh parsley.',
                        ],
                        'user_id' => $user->id,
                        'created_by' => $user->name,
                        'created_at' => $faker->dateTimeBetween('-1 year', 'now')
                    ],
                    [
                        'name' => 'Avocado Smoothie',
                        'description' => 'A creamy and nutritious smoothie made with avocado, milk, and honey.',
                        'ingredients' => ['avocado', 'milk', 'honey', 'lime', 'ice'],
                        'instructions' => [
                            'Blend avocado, milk, honey, and ice together.',
                            'Squeeze in fresh lime juice.',
                            'Blend until smooth and creamy.',
                            'Serve chilled with a lime wedge.',
                        ],
                        'user_id' => $user->id,
                        'created_by' => $user->name,
                        'created_at' => $faker->dateTimeBetween('-1 year', 'now')
                    ]
                ],

                $user3->id => [
                    [
                        'name' => 'Vegetarian Stir-Fry',
                        'description' => 'A healthy and colorful stir-fry packed with fresh vegetables and a savory sauce.',
                        'ingredients' => ['broccoli', 'carrots', 'bell peppers', 'tofu', 'soy sauce', 'ginger'],
                        'instructions' => [
                            'Stir-fry tofu cubes until crispy.',
                            'Add chopped vegetables and stir-fry until tender.',
                            'Mix soy sauce and ginger, then toss everything together.',
                            'Serve hot with steamed rice.',
                        ],
                        'user_id' => $user->id,
                        'created_by' => $user->name,
                        'created_at' => $faker->dateTimeBetween('-1 year', 'now')
                    ],
                    [
                        'name' => 'Breakfast Burrito',
                        'description' => 'A hearty burrito filled with scrambled eggs, avocado, cheese, and salsa.',
                        'ingredients' => ['eggs', 'avocado', 'tortilla', 'cheese', 'salsa', 'cilantro'],
                        'instructions' => [
                            'Scramble eggs with salt and pepper.',
                            'Warm tortillas and fill with scrambled eggs, cheese, avocado, and salsa.',
                            'Roll up the burritos and garnish with fresh cilantro.',
                            'Serve warm with a side of salsa.',
                        ],
                        'user_id' => $user->id,
                        'created_by' => $user->name,
                        'created_at' => $faker->dateTimeBetween('-1 year', 'now')
                    ]
                ]
            };

            $categories = Categories::all();
            foreach ($recipes as $recipe) {
                $recipeModel = Recipes::create(array_merge($recipe, [
                    'user_id' => $user->id,
                    'category_id' => $categories->random()->id,
                    'created_by' => $user->name,
                    'created_at' => $faker->dateTimeBetween('-1 year', 'now')
                ]));
                $recipeModel->categories()->attach($categories->random());
            }
        }
    }
}
