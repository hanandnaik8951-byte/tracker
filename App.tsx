import React, { useState } from 'react';
import MealCard from './components/MealCard';
import NutrientDisplay from './components/NutrientDisplay';
import HistoryLog from './components/HistoryLog';
import EditFoodModal from './components/EditFoodModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import WeightTracker from './components/WeightTracker';
import SleepTracker from './components/SleepTracker';
import { MealType, NutrientTotals, FoodItem } from './types';
import { useDailyLog } from './hooks/useDailyLog';
import { LoaderIcon } from './components/icons';

interface FoodToDelete {
  food: FoodItem;
  mealType: MealType;
}

type ActiveView = 'diet' | 'weight' | 'sleep';

const App: React.FC = () => {
  const { dailyLogs, todaysLog, addFoodItem, updateFoodItem, deleteFoodItem, isInitializing } = useDailyLog();
  const [editingFood, setEditingFood] = useState<{ food: FoodItem, mealType: MealType } | null>(null);
  const [deletingFood, setDeletingFood] = useState<FoodToDelete | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('diet');

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <LoaderIcon className="w-12 h-12 text-primary" />
      </div>
    );
  }

  const emptyTotals: NutrientTotals = { calories: 0, protein: 0, carbs: 0, fats: 0 };
  const meals = todaysLog?.meals || {
    [MealType.Breakfast]: [],
    [MealType.Lunch]: [],
    [MealType.Dinner]: [],
    [MealType.Snacks]: [],
  };

  const handleEdit = (food: FoodItem, mealType: MealType) => {
    setEditingFood({ food, mealType });
  };
  
  const handleSaveEdit = (updatedFood: FoodItem) => {
    if (editingFood) {
      updateFoodItem(editingFood.mealType, updatedFood);
      setEditingFood(null);
    }
  };

  const handleDelete = (food: FoodItem, mealType: MealType) => {
    setDeletingFood({ food, mealType });
  };

  const handleConfirmDelete = () => {
    if (deletingFood) {
      deleteFoodItem(deletingFood.mealType, deletingFood.food.id);
      setDeletingFood(null);
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'diet':
        return (
          <main className="max-w-4xl mx-auto p-4 md:p-8">
            <NutrientDisplay totals={todaysLog?.totals || emptyTotals} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MealCard 
                mealType={MealType.Breakfast} 
                foods={meals.Breakfast} 
                addFoodItem={addFoodItem}
                onEdit={(food) => handleEdit(food, MealType.Breakfast)}
                onDelete={handleDelete}
              />
              <MealCard 
                mealType={MealType.Lunch} 
                foods={meals.Lunch} 
                addFoodItem={addFoodItem} 
                onEdit={(food) => handleEdit(food, MealType.Lunch)}
                onDelete={handleDelete}
              />
              <MealCard 
                mealType={MealType.Dinner} 
                foods={meals.Dinner} 
                addFoodItem={addFoodItem}
                onEdit={(food) => handleEdit(food, MealType.Dinner)}
                onDelete={handleDelete}
              />
              <MealCard 
                mealType={MealType.Snacks} 
                foods={meals.Snacks} 
                addFoodItem={addFoodItem}
                onEdit={(food) => handleEdit(food, MealType.Snacks)}
                onDelete={handleDelete}
              />
            </div>
            <HistoryLog logs={dailyLogs} />
          </main>
        );
      case 'weight':
        return <WeightTracker />;
      case 'sleep':
        return <SleepTracker />;
      default:
        return null;
    }
  }

  const title = activeView.charAt(0).toUpperCase() + activeView.slice(1);

  return (
    <div className="min-h-screen bg-base-100 font-sans">
      <header className="bg-primary text-primary-content shadow-md p-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center gap-8">
            <h1 className="text-3xl font-bold">{title}</h1>
            <nav className="flex items-center gap-4 border-l border-violet-400 pl-6">
                <button
                    onClick={() => setActiveView('diet')}
                    className={`pb-1 border-b-2 text-lg transition-colors ${
                    activeView === 'diet' ? 'border-white font-semibold' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                >
                    Diet
                </button>
                <button
                    onClick={() => setActiveView('weight')}
                    className={`pb-1 border-b-2 text-lg transition-colors ${
                    activeView === 'weight' ? 'border-white font-semibold' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                >
                    Weight
                </button>
                <button
                    onClick={() => setActiveView('sleep')}
                    className={`pb-1 border-b-2 text-lg transition-colors ${
                    activeView === 'sleep' ? 'border-white font-semibold' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                >
                    Sleep
                </button>
            </nav>
        </div>
      </header>
      
      {renderActiveView()}

      {editingFood && (
        <EditFoodModal
          food={editingFood.food}
          onSave={handleSaveEdit}
          onClose={() => setEditingFood(null)}
        />
      )}

      {deletingFood && (
        <ConfirmDeleteModal
          onConfirm={handleConfirmDelete}
          onClose={() => setDeletingFood(null)}
        />
      )}

      <footer className="text-center p-4 mt-8 text-gray-400 text-sm">
        <p>✨ Magic by Gemini API ✨</p>
      </footer>
    </div>
  );
};

export default App;