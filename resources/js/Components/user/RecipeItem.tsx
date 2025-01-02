import { useState } from 'react';
import { DataProps, Recipe } from '@/types';

export default function RecipeItem({ data, onEdit }: DataProps) {
    const [form, setForm] = useState<Recipe>(data);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    return (
        <div className="relative overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
            <div className="absolute top-4 right-4 flex space-x-2">
                <button
                    className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
                    onClick={() => {
                        handleChange;
                        onEdit(form);
                    }}
                >
                    Edit
                </button>
                <button
                    className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none"
                >
                    Delete
                </button>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {data.name}
                </h3>

                {data.description && (
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        {data.description}
                    </p>
                )}

                <>
                    <div className="mt-4">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Ingredients:
                        </h4>
                        <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                            {data.ingredients?.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>

                        <h4 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                            Instructions:
                        </h4>
                        <ol className="list-decimal pl-5 text-gray-700 dark:text-gray-300">
                            {data.instructions?.map((instruction, index) => (
                                <li key={index}>{instruction}</li>
                            ))}
                        </ol>
                    </div>
                </>
            </div>
        </div>
    );
}
