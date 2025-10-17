import React, { useState } from 'react';
import { useSleepLog } from '../hooks/useSleepLog';
import { LoaderIcon, TrashIcon } from './icons';
import { SleepEntry } from '../types';

const StatCard: React.FC<{ label: string; value: string | number; unit?: string; className?: string }> = ({ label, value, unit, className }) => (
    <div className={`flex flex-col items-center justify-center p-4 bg-base-100 rounded-lg shadow-sm ${className}`}>
        <div className="text-2xl font-bold text-neutral">{value} <span className="text-lg font-medium text-gray-400">{unit}</span></div>
        <div className="text-sm text-gray-300">{label}</div>
    </div>
);

const SleepTracker: React.FC = () => {
    const { entries, todaysEntry, addSleepEntry, deleteSleepEntry, isInitializing } = useSleepLog();
    const [sleepTime, setSleepTime] = useState('23:00');
    const [wakeTime, setWakeTime] = useState('07:00');

    const handleLogSleep = (e: React.FormEvent) => {
        e.preventDefault();
        if (sleepTime && wakeTime) {
            addSleepEntry(sleepTime, wakeTime);
        }
    };
    
    if (isInitializing) {
        return (
          <div className="max-w-4xl mx-auto p-4 md:p-8 flex justify-center">
            <LoaderIcon className="w-10 h-10 text-primary" />
          </div>
        );
    }

    const averageSleep = entries.length > 0 ? entries.reduce((acc, entry) => acc + entry.duration, 0) / entries.length : 0;

    const formatDuration = (hours: number) => {
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        return `${h}h ${m}m`;
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
            {/* --- Summary --- */}
            <div className="bg-base-200 p-6 rounded-2xl shadow-lg shadow-primary/10">
                <h2 className="text-2xl font-bold text-neutral mb-4">Sleep & Recovery</h2>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    <StatCard label="Last Night's Sleep" value={todaysEntry ? formatDuration(todaysEntry.duration) : '-'} />
                    <StatCard label="7-Day Average" value={averageSleep > 0 ? formatDuration(averageSleep) : '-'} />
                </div>
            </div>

            {/* --- Log Sleep Form --- */}
            <div className="bg-base-200 p-6 rounded-2xl shadow-lg shadow-primary/10">
                <h3 className="text-xl font-bold text-neutral mb-4">Log Your Sleep</h3>
                <form onSubmit={handleLogSleep} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label htmlFor="sleepTime" className="block text-sm font-medium text-gray-300 mb-1">Went to Bed</label>
                        <input
                            type="time"
                            id="sleepTime"
                            value={sleepTime}
                            onChange={(e) => setSleepTime(e.target.value)}
                            className="w-full p-3 bg-base-300 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-neutral"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="wakeTime" className="block text-sm font-medium text-gray-300 mb-1">Woke Up</label>
                        <input
                            type="time"
                            id="wakeTime"
                            value={wakeTime}
                            onChange={(e) => setWakeTime(e.target.value)}
                            className="w-full p-3 bg-base-300 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-neutral"
                            required
                        />
                    </div>
                    <button type="submit" className="p-3 bg-primary text-white rounded-lg hover:bg-primary-focus transition duration-200 h-12">
                        Log Sleep
                    </button>
                </form>
            </div>
            
            {/* --- History --- */}
            <div className="bg-base-200 p-6 rounded-2xl shadow-lg shadow-primary/10">
                <h3 className="text-xl font-bold text-neutral mb-4">Sleep Log</h3>
                {entries.length > 0 ? (
                    <ul className="space-y-3 max-h-96 overflow-y-auto">
                        {entries.map((entry: SleepEntry) => (
                            <li key={entry.date} className="flex justify-between items-center p-3 bg-base-300 rounded-lg">
                                <div>
                                    <p className="font-semibold">{new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                    <p className="text-sm text-gray-400">{entry.sleepTime} - {entry.wakeTime}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-primary">{formatDuration(entry.duration)}</span>
                                    <button onClick={() => deleteSleepEntry(entry.date)} className="text-gray-400 hover:text-red-500">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 text-center py-4">No sleep entries yet. Log your sleep to begin your recovery quest!</p>
                )}
            </div>
        </div>
    );
};

export default SleepTracker;