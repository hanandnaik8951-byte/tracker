import React from 'react';
import { NutrientTotals } from '../types';

interface NutrientDisplayProps {
  totals: NutrientTotals;
}

const NutrientItem: React.FC<{ 
    label: string; 
    value: number; 
    unit: string; 
    color: string; 
}> = ({ label, value, unit, color }) => {
    return (
      <div className="flex flex-col items-center justify-center text-center p-4 bg-base-100 rounded-lg shadow-sm h-full min-h-[120px]">
        <div className={`text-3xl font-bold ${color}`}>{Math.round(value)}</div>
        <div className="text-sm text-gray-300 mt-1">{label}</div>
        <div className="text-xs text-gray-400">{unit}</div>
      </div>
    );
};

const NutrientDisplay: React.FC<NutrientDisplayProps> = ({ totals }) => {
  return (
    <div className="bg-base-200 p-6 rounded-2xl shadow-lg shadow-primary/10 mb-8">
      <h2 className="text-2xl font-bold text-neutral mb-4 text-center">Today's Stats</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NutrientItem label="Energy" value={totals.calories} unit="kcal" color="text-accent" />
        <NutrientItem 
            label="Strength" 
            value={totals.protein} 
            unit="g" 
            color="text-secondary" 
        />
        <NutrientItem 
            label="Stamina" 
            value={totals.carbs} 
            unit="g" 
            color="text-yellow-400"
        />
        <NutrientItem 
            label="Vitality" 
            value={totals.fats} 
            unit="g" 
            color="text-lime-400" 
        />
      </div>
    </div>
  );
};

export default NutrientDisplay;