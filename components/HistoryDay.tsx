import React, { useState } from 'react';
import { DailyLog, FoodItem } from '../types';
import { ChevronDownIcon, ChevronUpIcon } from './icons';

interface HistoryDayProps {
  log: DailyLog;
}

const HistoryDay: React.FC<HistoryDayProps> = ({ log }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1); // Adjust for timezone issues
    return new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  };

  const NutrientInfo: React.FC<{item: FoodItem}> = ({ item }) => (
    <div className="flex justify-between items-center text-xs text-gray-400 mt-1 pl-4">
        <span>E: {item.calories.toFixed(0)}kcal</span>
        <span>S: {item.protein.toFixed(1)}g</span>
        <span>S: {item.carbs.toFixed(1)}g</span>
        <span>V: {item.fats.toFixed(1)}g</span>
    </div>
  );


  return (
    <div className="bg-base-200 rounded-2xl shadow-lg shadow-primary/10 mb-4">
      <div className="p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-lg">{formatDate(log.date)}</h4>
          <div className="flex items-center gap-4 text-sm">
            <span className="font-semibold text-accent">{log.totals.calories.toFixed(0)} kcal</span>
            <button className="text-gray-400">
                {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-base-300">
          {Object.entries(log.meals).map(([mealType, foods]) => (
            foods.length > 0 && (
              <div key={mealType} className="mt-4">
                <h5 className="font-semibold text-primary">{mealType}</h5>
                <ul className="mt-2 space-y-2">
                  {foods.map(food => (
                    <li key={food.id} className="p-2 bg-base-300 rounded-md">
                        <p className="font-medium text-sm">{food.name}</p>
                        <NutrientInfo item={food} />
                    </li>
                  ))}
                </ul>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryDay;