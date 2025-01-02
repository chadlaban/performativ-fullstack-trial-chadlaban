import { useState } from 'react';
import { DataProps, Recipe } from '@/types';
import Modal from '../Modal';

export default function RecipeItem({ data, onEdit, onDelete }: DataProps) {
    const [form, setForm] = useState<Recipe>(data);
    const [modal, setModal] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const confirmDelete = () => {
        setModal(false);
        onDelete(data.id);
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
                    onClick={() => setModal(true)}
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

            {/* confirmation modal */}
            <Modal
                maxWidth='md'
                show={modal}
                onClose={() => setModal(false)}
            >
                <div className="p-4 text-center">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Are you sure you want to delete this recipe?
                    </h2>
                    <div className="mt-4 flex justify-center space-x-4">
                        <button
                            className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none"
                            onClick={confirmDelete}
                        >
                            Yes, Delete.
                        </button>
                        <button
                            className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none"
                            onClick={() => setModal(false)}
                        >
                            No
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
