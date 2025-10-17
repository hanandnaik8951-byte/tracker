import React from 'react';
import { DailyLog } from '../types';
import HistoryDay from './HistoryDay';

interface HistoryLogProps {
  logs: DailyLog[];
}

const HistoryLog: React.FC<HistoryLogProps> = ({ logs }) => {
  // Exclude today's log from the history view
  const historyLogs = logs.slice(1);

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-neutral mb-6 text-center">Logbook</h2>
      {historyLogs.length > 0 ? (
        historyLogs.map(log => <HistoryDay key={log.date} log={log} />)
      ) : (
        <p className="text-center text-gray-400 bg-base-200 p-6 rounded-lg shadow">No past entries yet. Start your quest!</p>
      )}
    </div>
  );
};

export default HistoryLog;