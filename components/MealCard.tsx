import React, { useState, useRef } from 'react';
import { FoodItem, MealType } from '../types';
import { analyzeFoodFromText, analyzeFoodFromImage } from '../services/geminiService';
import { PlusIcon, CameraIcon, LoaderIcon, EditIcon, TrashIcon } from './icons';

interface MealCardProps {
  mealType: MealType;
  foods: FoodItem[];
  addFoodItem: (mealType: MealType, foodItems: Omit<FoodItem, 'id'>[]) => void;
  onEdit: (food: FoodItem) => void;
  onDelete: (food: FoodItem, mealType: MealType) => void;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

const MealCard: React.FC<MealCardProps> = ({ mealType, foods, addFoodItem, onEdit, onDelete }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const newFoods = await analyzeFoodFromText(inputText);
      if (newFoods && newFoods.length > 0) {
        addFoodItem(mealType, newFoods);
        setInputText('');
      } else {
        setError("Could not find nutritional information for that food.");
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    try {
      const base64Image = await fileToBase64(file);
      const newFoods = await analyzeFoodFromImage(base64Image, file.type);
      if (newFoods && newFoods.length > 0) {
        addFoodItem(mealType, newFoods);
      } else {
        setError("Could not identify food in the image.");
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const NutrientInfo: React.FC<{item: FoodItem}> = ({ item }) => (
    <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
        <span>E: {item.calories.toFixed(0)}kcal</span>
        <span>S: {item.protein.toFixed(1)}g</span>
        <span>S: {item.carbs.toFixed(1)}g</span>
        <span>V: {item.fats.toFixed(1)}g</span>
    </div>
  );

  return (
    <div className="bg-base-200 p-6 rounded-2xl shadow-lg shadow-primary/10 mb-6">
      <h3 className="text-xl font-bold text-neutral mb-4">{mealType}</h3>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="e.g., '2 slices of cheese pizza'"
          className="flex-grow p-3 bg-base-300 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-neutral placeholder-gray-400"
          disabled={isLoading}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-3 bg-secondary text-white rounded-lg hover:bg-pink-600 transition duration-200 flex items-center justify-center"
          disabled={isLoading}
        >
          <CameraIcon />
        </button>
        <button
          type="submit"
          className="p-3 bg-primary text-white rounded-lg hover:bg-primary-focus transition duration-200 flex items-center justify-center"
          disabled={isLoading || !inputText.trim()}
        >
          {isLoading ? <LoaderIcon /> : <PlusIcon />}
        </button>
      </form>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <ul className="space-y-3">
        {foods.map((food) => (
          <li key={food.id} className="p-3 bg-base-300 rounded-lg">
            <div className="flex justify-between items-center">
                <span className="font-semibold">{food.name}</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(food)} className="text-gray-400 hover:text-secondary"><EditIcon className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(food, mealType)} className="text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
                </div>
            </div>
            <NutrientInfo item={food} />
          </li>
        ))}
        {isLoading && (
          <li className="p-3 bg-base-300 rounded-lg">
            <div className="flex items-center gap-3">
              <LoaderIcon className="w-5 h-5 text-primary" />
              <span className="font-semibold text-gray-400">Analyzing your food...</span>
            </div>
          </li>
        )}
        {foods.length === 0 && !isLoading && <p className="text-gray-400 text-sm text-center py-4">No items collected for this meal.</p>}
      </ul>
    </div>
  );
};

export default MealCard;