<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Recipes extends Model
{
    protected $casts = [
        'ingredients' => 'array',
        'instructions' => 'array',
    ];

    protected $fillable = [
        'name',
        'description',
        'ingredients',
        'instructions',
        'user_id',
        'category_id',
        'created_by',
        'created_at',
        'deleted_at',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Categories::class, 'categories_recipes');
    }
}
