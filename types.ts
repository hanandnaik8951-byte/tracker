import React from 'react';

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export enum MealType {
  Breakfast = "Breakfast",
  Lunch = "Lunch",
  Dinner = "Dinner",
  Snacks = "Snacks",
}

export type Meals = {
  [key in MealType]: FoodItem[];
};

export interface DailyLog {
  date: string; // YYYY-MM-DD
  meals: Meals;
  totals: NutrientTotals;
}

export interface NutrientTotals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface WeightEntry {
  date: string; // YYYY-MM-DD
  weight: number;
}

export interface WeightGoal {
  startingWeight: number;
  targetWeight: number;
  startDate: string; // YYYY-MM-DD
}

export interface SleepEntry {
  date: string; // YYYY-MM-DD (Date of waking up)
  sleepTime: string; // HH:MM
  wakeTime: string; // HH:MM
  duration: number; // in hours
}