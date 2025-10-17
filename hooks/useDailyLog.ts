import { useState, useEffect, useCallback } from 'react';
import { DailyLog, FoodItem, MealType, Meals, NutrientTotals } from '../types';

const getTodaysDateString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD
};

const createEmptyMeals = (): Meals => ({
  [MealType.Breakfast]: [],
  [MealType.Lunch]: [],
  [MealType.Dinner]: [],
  [MealType.Snacks]: [],
});

const calculateTotals = (meals: Meals): NutrientTotals => {
  const totals: NutrientTotals = { calories: 0, protein: 0, carbs: 0, fats: 0 };
  for (const meal of Object.values(meals)) {
    for (const item of meal) {
      totals.calories += item.calories;
      totals.protein += item.protein;
      totals.carbs += item.carbs;
      totals.fats += item.fats;
    }
  }
  return totals;
};

export const useDailyLog = () => {
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    try {
      const storedLogs = localStorage.getItem('nutriTrackLogs');
      if (storedLogs) {
        setDailyLogs(JSON.parse(storedLogs));
      }
    } catch (error) {
      console.error("Failed to load logs from localStorage", error);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    if (isInitializing) return; // Don't save initial empty state
    try {
      localStorage.setItem('nutriTrackLogs', JSON.stringify(dailyLogs));
    } catch (error) {
      console.error("Failed to save logs to localStorage", error);
    }
  }, [dailyLogs, isInitializing]);

  const getTodaysLog = useCallback(() => {
    const todayStr = getTodaysDateString();
    return dailyLogs.find(log => log.date === todayStr);
  }, [dailyLogs]);

  const addFoodItem = useCallback((mealType: MealType, foodItems: Omit<FoodItem, 'id'>[]) => {
    const todayStr = getTodaysDateString();
    
    setDailyLogs(prevLogs => {
      const newLogs = [...prevLogs];
      let todayLog = newLogs.find(log => log.date === todayStr);

      if (!todayLog) {
        todayLog = {
          date: todayStr,
          meals: createEmptyMeals(),
          totals: { calories: 0, protein: 0, carbs: 0, fats: 0 }
        };
        newLogs.unshift(todayLog); // Add to the beginning
      }

      const newFoodItemsWithId = foodItems.map(item => ({...item, id: crypto.randomUUID()}));
      todayLog.meals[mealType] = [...todayLog.meals[mealType], ...newFoodItemsWithId];
      todayLog.totals = calculateTotals(todayLog.meals);
      
      return newLogs;
    });
  }, []);

  const updateFoodItem = useCallback((mealType: MealType, updatedFood: FoodItem) => {
    const todayStr = getTodaysDateString();
    setDailyLogs(prevLogs => {
      const newLogs = [...prevLogs];
      const todayLog = newLogs.find(log => log.date === todayStr);

      if (todayLog) {
        const meal = todayLog.meals[mealType];
        const foodIndex = meal.findIndex(item => item.id === updatedFood.id);
        if (foodIndex > -1) {
          meal[foodIndex] = updatedFood;
          todayLog.totals = calculateTotals(todayLog.meals);
        }
      }
      return newLogs;
    });
  }, []);

  const deleteFoodItem = useCallback((mealType: MealType, foodId: string) => {
    const todayStr = getTodaysDateString();
    setDailyLogs(prevLogs => {
        const newLogs = [...prevLogs];
        const todayLog = newLogs.find(log => log.date === todayStr);

        if (todayLog) {
            todayLog.meals[mealType] = todayLog.meals[mealType].filter(item => item.id !== foodId);
            todayLog.totals = calculateTotals(todayLog.meals);
        }
        return newLogs;
    });
  }, []);


  return {
    dailyLogs,
    todaysLog: getTodaysLog(),
    isInitializing,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
  };
};