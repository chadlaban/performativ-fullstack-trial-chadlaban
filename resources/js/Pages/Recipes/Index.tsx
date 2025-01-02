import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RecipeItem from '@/Components/user/RecipeItem';
import { RecipeList, Recipe } from '@/types';

export default function index({ recipes }: { recipes: RecipeList }) {
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
                    {/* recipe list based on user currently logged in */}
                    <div className="mt-8 grid grid-cols-1 gap-6">
                        {recipes.map((recipe: Recipe) => (
                            <RecipeItem key={recipe.id} data={recipe} />
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
