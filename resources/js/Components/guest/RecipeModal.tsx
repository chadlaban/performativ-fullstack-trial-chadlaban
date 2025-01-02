import { useState, useEffect } from "react";
import { RecipeModalProps, NutritionalValues } from "@/types";

export default function RecipeModal({ recipe, closeModal }: RecipeModalProps) {
    if (!recipe) return null;

    const [nutritionalInfo, setNutritionalInfo] = useState<{ [ingredient: string]: NutritionalValues | string }>({});
    const apiKey = import.meta.env.VITE_NUTRITION_API_KEY;

    // fetch nutritional information for each ingredient on the selected recipe
    const fetchNutritionalValue = (ingredient: string) => {
        const query = encodeURIComponent(ingredient);
        const apiUrl = `${import.meta.env.VITE_NUTRITION_URL}${query}`;

        fetch(apiUrl, {
            headers: {
                'X-Api-Key': apiKey,
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error(`Error fetching data for ${ingredient}.`);
                return response.json();
            })
            .then((data) => {
                if (data && data.length > 0) {
                    setNutritionalInfo((prevState) => ({
                        ...prevState,
                        [ingredient]: data[0]
                            ? {
                                fat_total_g: data[0].fat_total_g,
                                fat_saturated_g: data[0].fat_saturated_g,
                                sodium_mg: data[0].sodium_mg,
                                potassium_mg: data[0].potassium_mg,
                                cholesterol_mg: data[0].cholesterol_mg,
                                carbohydrates_total_g: data[0].carbohydrates_total_g,
                                fiber_g: data[0].fiber_g,
                                sugar_g: data[0].sugar_g,
                            }
                            : 'N/A',
                    }));
                } else {
                    setNutritionalInfo((prevState) => ({
                        ...prevState,
                        [ingredient]: 'Nutritional info not found',
                    }));
                }
            })
            .catch((error) => {
                console.error('Error fetching nutritional data:', error);
                setNutritionalInfo((prevState) => ({
                    ...prevState,
                    [ingredient]: 'Error fetching data',
                }));
            });
    };


    // Fetch nutritional values for all ingredients when the recipe changes
    useEffect(() => {
        if (recipe && recipe.ingredients) {
            recipe.ingredients.forEach(ingredient => {
                fetchNutritionalValue(ingredient);
            });
        }
    }, [recipe]);


    return (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-75 flex justify-center items-center z-50">
            <div className="flex items-start bg-white p-8 rounded-lg shadow-2xl max-w-4xl w-full">
                <article className="w-full">
                    <h2 className="font-semibold text-3xl mb-4 text-gray-800">{recipe.name}</h2>
                    <p className="text-gray-700 mb-4 text-lg">{recipe.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <strong className="block mb-2 text-gray-800">Ingredients:</strong>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                {recipe.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <strong className="block mb-2 text-gray-800">Instructions:</strong>
                            <ul className="list-decimal pl-5 text-gray-700 space-y-1">
                                {recipe.instructions.map((instruction, index) => (
                                    <li key={index}>{instruction}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {/* nutritional value section */}
                    <div className="mt-6">
                        <strong className="block mb-2 text-gray-800">Nutritional Value:</strong>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-y-auto max-h-60 scroll-smooth border-t border-gray-200 pt-4">
                            {recipe.ingredients.map((ingredient, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col border border-gray-200 rounded-md p-4 bg-gray-50 shadow-sm"
                                >
                                    <span className="font-semibold text-gray-800">{ingredient}</span>
                                    <div className="text-sm text-gray-600 mt-2">
                                        {nutritionalInfo[ingredient] ? (
                                            typeof nutritionalInfo[ingredient] === 'object' && (
                                                <div className="mt-2 grid grid-cols-2 gap-4">
                                                    <div><strong>Total Fat:</strong> {nutritionalInfo[ingredient].fat_total_g} g</div>
                                                    <div><strong>Saturated Fat:</strong> {nutritionalInfo[ingredient].fat_saturated_g} g</div>
                                                    <div><strong>Sodium:</strong> {nutritionalInfo[ingredient].sodium_mg} mg</div>
                                                    <div><strong>Potassium:</strong> {nutritionalInfo[ingredient].potassium_mg} mg</div>
                                                    <div><strong>Cholesterol:</strong> {nutritionalInfo[ingredient].cholesterol_mg} mg</div>
                                                    <div><strong>Total Carbohydrates:</strong> {nutritionalInfo[ingredient].carbohydrates_total_g} g</div>
                                                    <div><strong>Fiber:</strong> {nutritionalInfo[ingredient].fiber_g} g</div>
                                                    <div><strong>Sugar:</strong> {nutritionalInfo[ingredient].sugar_g} g</div>
                                                </div>
                                            )
                                        ) : (
                                            'Loading...'
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </article>
                <button
                    onClick={closeModal}
                    className="relative text-gray-500 hover:text-gray-700 text-2xl"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
