import React, { useState } from 'react';
import { useWeightLog } from '../hooks/useWeightLog';
import GoalSetupModal from './GoalSetupModal';
import WeightChart from './WeightChart';
import { TrashIcon, EditIcon, LoaderIcon } from './icons';
import { WeightEntry } from '../types';

const StatCard: React.FC<{ label: string; value: string | number; unit?: string; className?: string }> = ({ label, value, unit, className }) => (
    <div className={`flex flex-col items-center justify-center p-4 bg-base-100 rounded-lg shadow-sm ${className}`}>
        <div className="text-2xl font-bold text-neutral">{value} <span className="text-lg font-medium text-gray-400">{unit}</span></div>
        <div className="text-sm text-gray-300">{label}</div>
    </div>
);

const ProgressBar: React.FC<{ start: number; current: number; goal: number }> = ({ start, current, goal }) => {
    const isLosingWeight = goal < start;
    const totalRange = Math.abs(start - goal);
    const progressMade = isLosingWeight ? start - current : current - start;

    let progressPercentage = totalRange > 0 ? (progressMade / totalRange) * 100 : 0;
    progressPercentage = Math.max(0, Math.min(progressPercentage, 100)); // Clamp between 0 and 100
    
    // Handle case where user is further from goal than start
    if ((isLosingWeight && current > start) || (!isLosingWeight && current < start)) {
        progressPercentage = 0;
    }

    return (
        <div className="w-full bg-base-300 rounded-full h-4 my-2 relative">
            <div className="bg-primary h-4 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px] shadow-primary" style={{ width: `${progressPercentage}%` }}></div>
            <span className="absolute top-0 left-0 -mt-5 text-xs font-semibold">{start} kg</span>
            <span className="absolute top-0 right-0 -mt-5 text-xs font-semibold">{goal} kg</span>
        </div>
    );
};


const WeightTracker: React.FC = () => {
    const { entries, goal, latestEntry, addWeightEntry, setWeightGoal, deleteWeightEntry, isInitializing } = useWeightLog();
    const [currentWeightInput, setCurrentWeightInput] = useState('');
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

    const handleLogWeight = (e: React.FormEvent) => {
        e.preventDefault();
        const weight = parseFloat(currentWeightInput);
        if (!isNaN(weight) && weight > 0) {
            addWeightEntry(weight);
            setCurrentWeightInput('');
        }
    };
    
    const handleSaveGoal = (goalData: { startingWeight: number; targetWeight: number }) => {
        setWeightGoal(goalData);
        setIsGoalModalOpen(false);
    };

    if (isInitializing) {
        return (
          <div className="max-w-4xl mx-auto p-4 md:p-8 flex justify-center">
            <LoaderIcon className="w-10 h-10 text-primary" />
          </div>
        );
    }

    const currentWeight = latestEntry?.weight;
    const weightToGo = (goal && currentWeight) ? (goal.targetWeight - currentWeight) : null;
    const isGoalAchieved = weightToGo !== null && ((goal.targetWeight > goal.startingWeight && currentWeight >= goal.targetWeight) || (goal.targetWeight < goal.startingWeight && currentWeight <= goal.targetWeight));

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
            {/* --- Summary & Goal --- */}
            <div className="bg-base-200 p-6 rounded-2xl shadow-lg shadow-primary/10">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-neutral">Weight Quest</h2>
                    <button onClick={() => setIsGoalModalOpen(true)} className="flex items-center gap-1 text-sm text-primary font-semibold hover:underline">
                        <EditIcon className="w-4 h-4" />
                        {goal ? 'Edit Goal' : 'Set Goal'}
                    </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <StatCard label="Current Weight" value={currentWeight ? currentWeight.toFixed(1) : '-'} unit="kg" />
                    <StatCard label="Starting Weight" value={goal ? goal.startingWeight.toFixed(1) : '-'} unit="kg" />
                    <StatCard label="Goal Weight" value={goal ? goal.targetWeight.toFixed(1) : '-'} unit="kg" />
                    <StatCard label={isGoalAchieved ? "Goal Achieved!" : "Weight to Go"} value={weightToGo ? weightToGo.toFixed(1) : '-'} unit="kg" className={isGoalAchieved ? 'text-primary' : ''}/>
                </div>

                {goal && currentWeight && (
                    <div className="mb-4">
                        <ProgressBar start={goal.startingWeight} current={currentWeight} goal={goal.targetWeight} />
                    </div>
                )}

                <WeightChart entries={entries} />
            </div>
            
            {/* --- Log Weight Form --- */}
            <div className="bg-base-200 p-6 rounded-2xl shadow-lg shadow-primary/10">
                <h3 className="text-xl font-bold text-neutral mb-4">Log Today's Weight</h3>
                <form onSubmit={handleLogWeight} className="flex gap-2">
                    <input
                        type="number"
                        step="0.1"
                        value={currentWeightInput}
                        onChange={(e) => setCurrentWeightInput(e.target.value)}
                        placeholder={`Enter weight in kg (e.g., ${currentWeight || 70.5})`}
                        className="flex-grow p-3 bg-base-300 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-neutral placeholder-gray-400"
                        required
                    />
                    <button type="submit" className="p-3 bg-primary text-white rounded-lg hover:bg-primary-focus transition duration-200">
                        Log Weight
                    </button>
                </form>
            </div>
            
            {/* --- History --- */}
            <div className="bg-base-200 p-6 rounded-2xl shadow-lg shadow-primary/10">
                <h3 className="text-xl font-bold text-neutral mb-4">Weight Log</h3>
                {entries.length > 0 ? (
                    <ul className="space-y-3 max-h-96 overflow-y-auto">
                        {entries.map((entry: WeightEntry) => (
                            <li key={entry.date} className="flex justify-between items-center p-3 bg-base-300 rounded-lg">
                                <span className="font-semibold">{new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                <div>
                                    <span className="font-bold mr-4">{entry.weight.toFixed(1)} kg</span>
                                    <button onClick={() => deleteWeightEntry(entry.date)} className="text-gray-400 hover:text-red-500">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 text-center py-4">No weight entries yet. Log your weight to get started!</p>
                )}
            </div>

            {isGoalModalOpen && (
                <GoalSetupModal
                    currentGoal={goal}
                    latestWeight={currentWeight}
                    onSave={handleSaveGoal}
                    onClose={() => setIsGoalModalOpen(false)}
                />
            )}
        </div>
    );
};

export default WeightTracker;