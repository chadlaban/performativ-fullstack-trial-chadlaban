<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Categories extends Model
{
    public function recipes(): BelongsToMany
    {
        return $this->belongsToMany(Recipe::class, 'categories_recipes');
    }
}
