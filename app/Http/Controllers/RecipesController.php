<?php

namespace App\Http\Controllers;

use App\Models\Recipes;
use App\Http\Resources\RecipesResource;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RecipesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user(); // authenticated user

        if (!$user) return response()->json(['message' => 'User not authenticated'], 401);

        $recipes = $user->recipes()->latest()->get();

        return Inertia::render('Recipes/Index', [
            'recipes' => RecipesResource::collection($recipes)
        ]);
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
        $user = auth()->user();

        if (!$user) return response()->json(['message' => 'User not authenticated'], 401);

        // validate incoming request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'ingredients' => 'required|array',
            'instructions' => 'required|array',
            'category_id' => 'numeric'
        ]);

        $recipe = Recipes::create([
            'name' => $validatedData['name'],
            'description' => $validatedData['description'],
            'ingredients' => $validatedData['ingredients'],
            'instructions' => $validatedData['instructions'],
            'category_id' => $validatedData['category_id'],
            'user_id' => $user->id,
            'created_by' => $user->name,
        ]);

        if ($request->has('category_id')) $recipe->categories()->sync($request->input('category_id'));

        return response()->json([
            'message' => 'Recipe created successfully!',
            'recipe' => $recipe,
        ], 201);
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
    public function edit(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'ingredients' => 'required|array',
            'ingredients.*' => 'string',
            'instructions' => 'required|array',
            'instructions.*' => 'string',
            'category_id' => 'numeric'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $recipe = Recipes::find($id);

        if (!$recipe) {
            return response()->json([
                'message' => 'Recipe not found',
            ], 404);
        }

        $recipe->name = $request->input('name');
        $recipe->description = $request->input('description');
        $recipe->ingredients = $request->input('ingredients');
        $recipe->instructions = $request->input('instructions');
        $recipe->categories()->sync($request->input('category_id'));

        $recipe->save();

        return response()->json([
            'message' => 'Recipe updated successfully',
            'data' => $recipe,
        ]);
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
