import { useState, useEffect, useCallback } from 'react';
import { SleepEntry } from '../types';

const getTodaysDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

const calculateDuration = (sleepTime: string, wakeTime: string): number => {
    const [sleepH, sleepM] = sleepTime.split(':').map(Number);
    const [wakeH, wakeM] = wakeTime.split(':').map(Number);
  
    // Use a consistent base date for calculation
    const sleepDate = new Date(2000, 0, 1, sleepH, sleepM);
    const wakeDate = new Date(2000, 0, 1, wakeH, wakeM);
  
    // If wake time is earlier than sleep time, it means it's the next day
    if (wakeDate.getTime() < sleepDate.getTime()) {
      wakeDate.setDate(wakeDate.getDate() + 1);
    }
  
    const durationMs = wakeDate.getTime() - sleepDate.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    return durationHours;
};


export const useSleepLog = () => {
  const [entries, setEntries] = useState<SleepEntry[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('nutriTrackSleepLog');
      if (storedData) {
        const parsedEntries = JSON.parse(storedData) || [];
        // Ensure entries are sorted on load
        const sortedEntries = parsedEntries.sort((a: SleepEntry, b: SleepEntry) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setEntries(sortedEntries);
      }
    } catch (error) {
      console.error("Failed to load sleep log from localStorage", error);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    if (isInitializing) return;
    try {
      localStorage.setItem('nutriTrackSleepLog', JSON.stringify(entries));
    } catch (error) {
      console.error("Failed to save sleep log to localStorage", error);
    }
  }, [entries, isInitializing]);

  const addSleepEntry = useCallback((sleepTime: string, wakeTime: string) => {
    const todayStr = getTodaysDateString();
    const duration = calculateDuration(sleepTime, wakeTime);

    const newEntry: SleepEntry = {
        date: todayStr,
        sleepTime,
        wakeTime,
        duration,
    };
    
    setEntries(prevEntries => {
      const newEntries = prevEntries.filter(entry => entry.date !== todayStr);
      newEntries.push(newEntry);
      return newEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }, []);
  
  const deleteSleepEntry = useCallback((date: string) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.date !== date));
  }, []);
  
  return {
    entries,
    isInitializing,
    addSleepEntry,
    deleteSleepEntry,
    todaysEntry: entries.find(e => e.date === getTodaysDateString()),
  };
};