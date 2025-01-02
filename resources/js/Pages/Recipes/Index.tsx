import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RecipeItem from '@/Components/user/RecipeItem';
import { RecipeList, Recipe } from '@/types';

export default function index({ recipes }: { recipes: RecipeList<Recipe> }) {
    // initial form state for create and edit
    const [form, setForm] = useState({
        id: null as number | null,
        name: '',
        description: '',
        category_id: '',
        ingredients: [''],
        instructions: [''],
    });

    // handle form inputs
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
        field: string,
        index?: number
    ) => {
        const { value } = e.target;

        if (field === 'ingredients' || field === 'instructions') {
            const updatedList = [...form[field as 'ingredients' | 'instructions']];
            updatedList[index!] = value;
            setForm({
                ...form,
                [field]: updatedList,
            });
        } else {
            setForm({
                ...form,
                [field]: value,
            });
        }
    };

    // triggers new inputs for array fields
    const handleAddInput = (field: 'ingredients' | 'instructions') => {
        setForm({
            ...form,
            [field]: [...form[field], ''],
        });
    };

    // form submission for both create and update
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        if (!csrfToken) {
            alert('CSRF token is missing');
            return;
        }

        const method = form.id ? 'PUT' : 'POST';
        const url = form.id ? `/api/edit_recipe/${form.id}` : '/api/add_recipe';

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify(form),
            credentials: 'same-origin',
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.error('Error:', errorData);
                        alert(`Failed: ${errorData.message || 'Unknown error'}`);
                        throw new Error('Request failed');
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log(`${method === 'POST' ? 'Created' : 'Updated'} recipe:`, data);
                alert(`${method === 'POST' ? 'Recipe created' : 'Recipe updated'} successfully!`);
                window.location.reload();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred.');
            });

        // console.log('Form Data:', form);
    };

    const handleEdit = (recipe: Recipe) => {
        setForm({
            id: recipe.id,
            name: recipe.name,
            category_id: String(recipe.category_id),
            description: recipe.description,
            ingredients: recipe.ingredients || [''],
            instructions: recipe.instructions || [''],
        });
    };

    const handleDelete = (id: number) => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (!csrfToken) {
            alert('CSRF token is missing');
            return;
        }

        fetch(`/api/delete_recipe/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.error('Error:', errorData);
                        alert(`Failed to delete recipe: ${errorData.message || 'Unknown error'}`);
                        throw new Error('Request failed');
                    });
                }
                return response.json();
            })
            .then(() => {
                alert('Recipe deleted successfully!');
                window.location.reload();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while deleting the recipe.');
            });
    };

    // console.log(recipes);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    My Recipes
                </h2>
            }
        >
            <Head title="My Recipes" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* recipe form */}
                    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            {form.id ? 'Edit Recipe' : 'Create New Recipe'}
                        </h3>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Recipe Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={(e) => handleInputChange(e, 'name')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                placeholder="Enter recipe name"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={(e) => handleInputChange(e, 'description')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                placeholder="Enter recipe description"
                            />
                        </div>

                        {/* recipe ingredients */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ingredients</label>
                            {form.ingredients.map((ingredient, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={ingredient}
                                        onChange={(e) => handleInputChange(e, 'ingredients', index)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                        placeholder={`Ingredient ${index + 1}`}
                                    />
                                    {form.ingredients.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updatedIngredients = form.ingredients.filter((_, i) => i !== index);
                                                setForm({ ...form, ingredients: updatedIngredients });
                                            }}
                                            className="text-red-600"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                            ))}
                            <button
                                type="button"
                                onClick={() => handleAddInput('ingredients')}
                                className="mt-2 text-blue-600"
                            >
                                Add Ingredient
                            </button>
                        </div>

                        {/* recipe instructions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Instructions</label>
                            {form.instructions.map((instruction, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={instruction}
                                        onChange={(e) => handleInputChange(e, 'instructions', index)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                        placeholder={`Step ${index + 1}`}
                                    />
                                    {form.instructions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updatedInstructions = form.instructions.filter((_, i) => i !== index);
                                                setForm({ ...form, instructions: updatedInstructions });
                                            }}
                                            className="text-red-600"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => handleAddInput('instructions')}
                                className="mt-2 text-blue-600"
                            >
                                Add Instruction
                            </button>
                        </div>

                        {/* category dd */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={form.category_id}
                                onChange={(e) => handleInputChange(e, 'category_id')}
                                className="w-48 p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white shadow-sm focus:ring-2 focus:ring-gray-500"
                            >
                                <option value="">Select a Category</option>
                                <option value="1">Breakfast</option>
                                <option value="2">Brunch</option>
                                <option value="3">Lunch</option>
                                <option value="4">Dinner</option>
                                <option value="5">Pre-workout</option>
                                <option value="6">Post-workout</option>
                                <option value="7">Snacks</option>
                            </select>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {form.id ? 'Update Recipe' : 'Create Recipe'}
                            </button>
                        </div>
                    </form>

                    {/* recipe item list */}
                    <div className="mt-8 grid grid-cols-1 gap-6">
                        {recipes.data.map((recipe: Recipe) => (
                            <RecipeItem key={recipe.id} data={recipe} onEdit={handleEdit} onDelete={handleDelete} />
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
