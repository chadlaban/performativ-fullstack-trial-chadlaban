import { useEffect, useState } from "react";
import { Head } from '@inertiajs/react';
import NavLink from "@/Components/NavLink";
import { InitUser, Recipe } from "@/types";
import { useRecipesFetch } from "@/Hooks/UseFetch";
import RecipeModal from "@/Components/guest/RecipeModal";

export default function LandingPage({ auth }: InitUser) {
    const [query, setQuery] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const { filteredRecipes, fetchFilteredRecipes } = useRecipesFetch();
    const [sortOption, setSortOption] = useState<string>('');
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchFilteredRecipes(query, category);
    }, []);

    // search bar and category sort trigger functions
    const handleSearchClick = () => {
        fetchFilteredRecipes(query, category);
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') fetchFilteredRecipes(query, category);
    };

    // frontend sorting
    const handleSorting = (recipes: Recipe[]) => {
        if (!sortOption) return recipes;

        return [...recipes].sort((a, b) => {
            switch (sortOption) {
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'date-newest':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case 'date-oldest':
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                default:
                    return 0;
            }
        });
    };

    const sortedRecipes = handleSorting(filteredRecipes);

    // modal trigger functions
    const openModal = (recipe: Recipe | null) => {
        setSelectedRecipe(recipe);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedRecipe(null);
        setIsModalOpen(false);
    };

    return (
        <>
            <Head title="Recipe Board" />
            <header className="bg-white shadow-md">
                <nav className="flex justify-end space-x-4 p-4 border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
                    {auth.user ? (
                        <NavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </NavLink>
                    ) : (
                        <>
                            <NavLink
                                href={route('login')}
                                active={route().current('dashboard')}
                            >
                                Log in
                            </NavLink>
                            <NavLink
                                href={route('register')}
                                active={route().current('dashboard')}
                            >
                                Register
                            </NavLink>
                        </>
                    )}
                </nav>
            </header>

            <main className="p-6 bg-gray-50 min-h-screen">
                <section className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Welcome to DishData
                    </h1>
                    <p className="text-lg text-gray-700">
                        Search for recipes and discover the nutritional values of the ingredients used.
                    </p>
                </section>

                <div className="flex flex-col space-y-6 mb-8">
                    {/* Note:
                        - search bar and category sorting are only triggered by triggering the
                        search button and pressing the 'enter' key.
                        - second dropdown sort automatically displays changes as it manipulates
                        changes on rendered data.
                    */}
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            placeholder="Search recipes..."
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-700 focus:outline-none"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                        <button
                            onClick={handleSearchClick}
                            className="p-3 bg-gray-600 text-white rounded-md shadow-md hover:bg-gray-700 transition"
                        >
                            Search
                        </button>
                    </div>

                    {/* sort filtering */}
                    <div className="flex gap-4">
                        <select
                            className="w-40 p-3 border border-gray-300 rounded-md bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-gray-500"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            <option value="1">Breakfast</option>
                            <option value="2">Brunch</option>
                            <option value="3">Lunch</option>
                            <option value="4">Dinner</option>
                            <option value="5">Pre-workout</option>
                            <option value="6">Post-workout</option>
                            <option value="7">Snacks</option>
                        </select>
                        <select
                            className="w-40 p-3 border border-gray-300 rounded-md bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-gray-500"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="">Sort By</option>
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                            <option value="date-newest">Date (Newest)</option>
                            <option value="date-oldest">Date (Oldest)</option>
                        </select>
                    </div>
                </div>

                {/* rendered recipe data */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedRecipes.length > 0 ? (
                        sortedRecipes.map((recipe) => (
                            <div
                                key={recipe.id}
                                className="p-4 border border-gray-200 rounded-lg shadow hover:shadow-lg bg-white transition cursor-pointer"
                                onClick={() => openModal(recipe)}
                            >
                                <h2 className="font-semibold text-xl text-gray-900 mb-2">
                                    {recipe.name}
                                </h2>
                                <p className="text-gray-600 mb-2 italic">
                                    Recipe By: {recipe.created_by}
                                </p>
                                <p className="text-gray-600 text-sm mb-2">
                                    Published On: {new Date(recipe.created_at).toLocaleDateString('en-US')}
                                </p>
                                <p className="text-gray-700">{recipe.description}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No recipes found.</p>
                    )}
                </div>

                {/* modal containing nutritional values */}
                {isModalOpen && <RecipeModal recipe={selectedRecipe} closeModal={closeModal} />}
            </main>
        </>
    );
}