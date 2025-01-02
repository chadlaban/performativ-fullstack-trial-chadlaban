<?php

namespace App\Http\Controllers;

use App\Models\Recipes;
use App\Http\Resources\RecipeResource;
use Inertia\Inertia;
use Illuminate\Http\Request;

class RecipesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $query, $category = null)
    {
        $searchQuery = $query;
        $category = $category ?? null; // optional

        $recipes = Recipes::query()
            ->when($searchQuery !== 'all' && !empty($searchQuery), function ($queryBuilder) use ($searchQuery, $category) {
                // error_log('---------');
                // error_log($searchQuery);
                // error_log($category);
                // error_log('---------');

                // search
                $queryBuilder->where(function ($query) use ($searchQuery, $category) {
                    if (!empty($category)) {
                        $query->whereHas('categories', function ($query) use ($category) {
                            $query->where('categories.id', $category);
                        });
                    }
                    $query->where(function ($query) use ($searchQuery) {
                        $query->where('name', 'like', '%' . $searchQuery . '%')
                            ->orWhere('description', 'like', '%' . $searchQuery . '%');
                    });
                });
            })
            ->when(!empty($category), function ($queryBuilder) use ($category) {
                // category
                $queryBuilder->whereHas('categories', function ($query) use ($category) {
                    $query->where('categories.id', $category);
                });
            })
            ->get();

        // error_log('---------');
        // error_log($recipes);
        // error_log('---------');

        return response()->json($recipes);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Recipes $recipes)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Recipes $recipes)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Recipes $recipes)
    {
        //
    }
}
