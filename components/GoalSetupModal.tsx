import React, { useState, useEffect } from 'react';
import { WeightGoal } from '../types';

interface GoalSetupModalProps {
  currentGoal: WeightGoal | null;
  latestWeight: number | undefined;
  onSave: (goalData: { startingWeight: number; targetWeight: number }) => void;
  onClose: () => void;
}

const GoalSetupModal: React.FC<GoalSetupModalProps> = ({ currentGoal, latestWeight, onSave, onClose }) => {
  const [start, setStart] = useState('');
  const [target, setTarget] = useState('');

  useEffect(() => {
    if (currentGoal) {
      setStart(String(currentGoal.startingWeight));
      setTarget(String(currentGoal.targetWeight));
    } else if (latestWeight) {
        // Pre-fill starting weight with the most recent entry if no goal is set
        setStart(String(latestWeight));
    }
  }, [currentGoal, latestWeight]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startNum = parseFloat(start);
    const targetNum = parseFloat(target);
    if (!isNaN(startNum) && !isNaN(targetNum)) {
      onSave({ startingWeight: startNum, targetWeight: targetNum });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-base-200 rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Set Your Weight Goal</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Starting Weight (kg)</label>
              <input type="number" step="0.1" value={start} onChange={(e) => setStart(e.target.value)} required className="mt-1 block w-full p-2 bg-base-300 border border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Goal Weight (kg)</label>
              <input type="number" step="0.1" value={target} onChange={(e) => setTarget(e.target.value)} required className="mt-1 block w-full p-2 bg-base-300 border border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-base-300 text-neutral rounded-lg hover:bg-gray-600 transition-colors">Cancel</button>
            <button type="submit" className="py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-focus transition-colors">Save Goal</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalSetupModal;