<?php

namespace Database\Seeders;

use App\Models\User;
use App\Enum\RolesEnum;
use App\Enum\PermissionsEnum;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // seed for user roles & permissions
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
        $guest = User::factory()->create([
            'name' => 'Guest User',
            'email' => 'guest@example.com',
            'password' => bcrypt('performativ1234'),
        ])->assignRole(RolesEnum::Guest);

        $user1 = User::factory()->create([
            'name' => 'Chad Doe',
            'email' => 'user1@example.com',
            'password' => bcrypt('performativ1234u1'),
        ])->assignRole(RolesEnum::User);

        $user2 = User::factory()->create([
            'name' => 'John Doe',
            'email' => 'user2@example.com',
            'password' => bcrypt('performativ1234u2'),
        ])->assignRole(RolesEnum::User);

        $user3 = User::factory()->create([
            'name' => 'Jane Doe',
            'email' => 'user3@example.com',
            'password' => bcrypt('performativ1234u3'),
        ])->assignRole(RolesEnum::User);

        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('performativAdmin1234'),
        ])->assignRole(RolesEnum::Admin);
    }
}
