import { useState, useEffect, useCallback } from 'react';
import { WeightEntry, WeightGoal } from '../types';

const getTodaysDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const useWeightLog = () => {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [goal, setGoal] = useState<WeightGoal | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('nutriTrackWeightLog');
      if (storedData) {
        const { entries, goal } = JSON.parse(storedData);
        // Ensure entries are sorted on load
        const sortedEntries = (entries || []).sort((a: WeightEntry, b: WeightEntry) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setEntries(sortedEntries);
        setGoal(goal || null);
      }
    } catch (error) {
      console.error("Failed to load weight log from localStorage", error);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    if (isInitializing) return;
    try {
      const dataToStore = JSON.stringify({ entries, goal });
      localStorage.setItem('nutriTrackWeightLog', dataToStore);
    } catch (error) {
      console.error("Failed to save weight log to localStorage", error);
    }
  }, [entries, goal, isInitializing]);

  const addWeightEntry = useCallback((weight: number) => {
    const todayStr = getTodaysDateString();
    setEntries(prevEntries => {
      const newEntries = prevEntries.filter(entry => entry.date !== todayStr);
      newEntries.push({ date: todayStr, weight });
      // Sort entries by date descending
      return newEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }, []);
  
  const deleteWeightEntry = useCallback((date: string) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.date !== date));
  }, []);
  
  const setWeightGoal = useCallback((newGoalData: { startingWeight: number; targetWeight: number }) => {
    setGoal(prevGoal => ({
      ...newGoalData,
      startDate: prevGoal?.startDate || getTodaysDateString(),
    }));
  }, []);

  return {
    entries,
    goal,
    isInitializing,
    addWeightEntry,
    deleteWeightEntry,
    setWeightGoal,
    latestEntry: entries[0] // Since they are sorted, the first one is the latest
  };
};