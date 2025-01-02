import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    permissions: string[];
    roles: string[];
}

export interface InitUser {
    auth: {
        user: User;
    };
}

export interface Recipe {
    id: number;
    name: string;
    description: string;
    category_id: number | string;
    ingredients: string[];
    instructions: string[];
    created_by: string;
    created_at: Date;
}

export interface Category {
    id: number;
    name: string;
}

export interface RecipeModalProps {
    recipe: Recipe | null;
    closeModal: () => void;
}

export interface NutritionalValues {
    fat_total_g: number;
    fat_saturated_g: number;
    sodium_mg: number;
    potassium_mg: number;
    cholesterol_mg: number;
    carbohydrates_total_g: number;
    fiber_g: number;
    sugar_g: number;
}

export type RecipeList<T = any> = {
    data: T[];
}

export type DataProps = {
    data: Recipe;
    onEdit: (updatedData: Recipe) => void;
};

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
};
