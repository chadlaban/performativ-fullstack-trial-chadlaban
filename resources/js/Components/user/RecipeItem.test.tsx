import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import RecipeItem from './RecipeItem';
import { Recipe } from '@/types';

const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

const recipeData: Recipe = {
    id: 1,
    name: 'Spaghetti Bolognese',
    description: 'A classic Italian pasta dish.',
    ingredients: ['Spaghetti', 'Ground Beef', 'Tomato Sauce'],
    instructions: ['Boil pasta', 'Cook beef', 'Mix ingredients'],
    category_id: '',
    created_by: '',
    created_at: new Date()
};

it('render component when provided data', () => {
    render(<RecipeItem data={recipeData} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText('Spaghetti Bolognese')).toBeInTheDocument();
    expect(screen.getByText('A classic Italian pasta dish.')).toBeInTheDocument();
    expect(screen.getByText('Spaghetti')).toBeInTheDocument();
    expect(screen.getByText('Ground Beef')).toBeInTheDocument();
    expect(screen.getByText('Tomato Sauce')).toBeInTheDocument();
    expect(screen.getByText('Boil pasta')).toBeInTheDocument();
    expect(screen.getByText('Cook beef')).toBeInTheDocument();
    expect(screen.getByText('Mix ingredients')).toBeInTheDocument();
});

it('onEdit callback function should respond when Edit button is triggered', () => {
    render(<RecipeItem data={recipeData} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    fireEvent.click(screen.getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalledWith(recipeData);
});

it('onDelete callback function should respond when the confirmation button is triggered on the modal', () => {
    render(<RecipeItem data={recipeData} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    fireEvent.click(screen.getByText('Delete'));
    fireEvent.click(screen.getByText('Yes, Delete.'));
    expect(mockOnDelete).toHaveBeenCalledWith(recipeData.id);
});
