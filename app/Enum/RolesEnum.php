<?php

namespace App\Enum;

enum RolesEnum: string
{
    case Admin = 'admin';
    case Guest = 'guest';
    case User = 'user';

    public static function labels(): array
    {
        return [
            self::Admin->value => 'Admin',
            self::Guest->value => 'Guest',
            self::User->value => 'User',
        ];
    }

    public function label()
    {
        return match($this) {
            self::Admin => 'Admin',
            self::Guest => 'Guest',
            self::User => 'User',
        };
    }
}
