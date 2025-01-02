import { useState } from 'react';
import { Recipe } from '@/types';

// search bar and category filtering
const useRecipesFetch = () => {
    const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);

    // Note: in case you've just seeded the database for the first time and
    // encountering 'GET http://localhost:8000/recipes/search/all 500 (Internal Server Error)'
    // please restart your server.
    const fetchFilteredRecipes = (query: string, category: string) => {
        const queryParam = query || 'all';
        const categoryParam = category ? `/${category}` : '';

        fetch(`/recipes/search/${queryParam}${categoryParam}`)
            .then((response) => {
                if (!response.ok) throw new Error('Error fetching filtered recipes');
                return response.json();
            })
            .then((data) => {
                setFilteredRecipes(data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return {
        filteredRecipes,
        fetchFilteredRecipes,
    };
};

export { useRecipesFetch };
