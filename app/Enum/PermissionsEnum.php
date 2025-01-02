<?php

namespace App\Enum;

enum PermissionsEnum: string
{
    case ManageUsers = 'manage_users';
    case ManageRecipes = 'manage_recipes';
}
