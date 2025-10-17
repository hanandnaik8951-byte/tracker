import React from 'react';
import { WeightEntry } from '../types';

interface WeightChartProps {
  entries: WeightEntry[];
}

const WeightChart: React.FC<WeightChartProps> = ({ entries }) => {
  if (entries.length < 2) {
    return (
      <div className="flex items-center justify-center h-48 bg-base-100 rounded-lg mt-6">
        <p className="text-gray-400">Log at least two weight entries to see your progress chart.</p>
      </div>
    );
  }

  // Sort entries from oldest to newest for charting
  const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const SVG_WIDTH = 500;
  const SVG_HEIGHT = 200;
  const PADDING = { top: 20, right: 20, bottom: 30, left: 40 };

  const weights = sortedEntries.map(e => e.weight);
  const dates = sortedEntries.map(e => new Date(e.date + 'T00:00:00'));

  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const weightRange = maxWeight - minWeight === 0 ? 1 : maxWeight - minWeight; // Avoid division by zero
  
  const startDate = dates[0].getTime();
  const endDate = dates[dates.length - 1].getTime();
  const dateRange = endDate - startDate === 0 ? 1 : endDate - startDate;

  // Functions to map data points to SVG coordinates
  const getX = (date: Date) => {
    return PADDING.left + ((date.getTime() - startDate) / dateRange) * (SVG_WIDTH - PADDING.left - PADDING.right);
  };

  const getY = (weight: number) => {
    return (SVG_HEIGHT - PADDING.bottom) - ((weight - minWeight) / weightRange) * (SVG_HEIGHT - PADDING.top - PADDING.bottom);
  };

  const pathData = sortedEntries
    .map((entry, i) => {
      const x = getX(dates[i]);
      const y = getY(entry.weight);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');

  const yAxisLabels = [minWeight, minWeight + weightRange / 2, maxWeight];

  return (
    <div className="mt-6">
       <h3 className="text-lg font-bold text-neutral mb-2">Progress Chart</h3>
      <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-auto">
        {/* Y-axis labels and grid lines */}
        {yAxisLabels.map((weight, i) => {
            const y = getY(weight);
            return (
                <g key={i}>
                    <text x={PADDING.left - 8} y={y + 3} textAnchor="end" fontSize="10" fill="currentColor" className="text-gray-400">
                        {weight.toFixed(1)}
                    </text>
                    <line x1={PADDING.left} x2={SVG_WIDTH - PADDING.right} y1={y} y2={y} stroke="currentColor" strokeWidth="0.5" className="text-gray-700" />
                </g>
            );
        })}

        {/* X-axis labels */}
        <text x={PADDING.left} y={SVG_HEIGHT - PADDING.bottom + 15} textAnchor="start" fontSize="10" fill="currentColor" className="text-gray-400">
          {dates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </text>
        <text x={SVG_WIDTH - PADDING.right} y={SVG_HEIGHT - PADDING.bottom + 15} textAnchor="end" fontSize="10" fill="currentColor" className="text-gray-400">
          {dates[dates.length - 1].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </text>
        
        {/* Line */}
        <path d={pathData} fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
        
        {/* Points */}
        {sortedEntries.map((entry, i) => {
          const x = getX(dates[i]);
          const y = getY(entry.weight);
          return (
            <circle key={i} cx={x} cy={y} r="3" fill="currentColor" className="text-primary-focus" />
          );
        })}
      </svg>
    </div>
  );
};

export default WeightChart;