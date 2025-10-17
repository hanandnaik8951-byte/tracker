import React, { useState, useEffect } from 'react';
import { FoodItem } from '../types';

interface EditFoodModalProps {
  food: FoodItem | null;
  onSave: (updatedFood: FoodItem) => void;
  onClose: () => void;
}

const EditFoodModal: React.FC<EditFoodModalProps> = ({ food, onSave, onClose }) => {
  const [formData, setFormData] = useState<FoodItem | null>(null);

  useEffect(() => {
    setFormData(food);
  }, [food]);

  if (!food || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: name === 'name' ? value : Number(value) } : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-base-200 rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Edit Food Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full p-2 bg-base-300 border border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Energy (kcal)</label>
                <input type="number" name="calories" value={formData.calories} onChange={handleChange} className="mt-1 block w-full p-2 bg-base-300 border border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Strength (g)</label>
                <input type="number" name="protein" value={formData.protein} onChange={handleChange} className="mt-1 block w-full p-2 bg-base-300 border border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Stamina (g)</label>
                <input type="number" name="carbs" value={formData.carbs} onChange={handleChange} className="mt-1 block w-full p-2 bg-base-300 border border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Vitality (g)</label>
                <input type="number" name="fats" value={formData.fats} onChange={handleChange} className="mt-1 block w-full p-2 bg-base-300 border border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-base-300 text-neutral rounded-lg hover:bg-gray-600 transition-colors">Cancel</button>
            <button type="submit" className="py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-focus transition-colors">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFoodModal;