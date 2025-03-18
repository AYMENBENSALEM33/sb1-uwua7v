import React from 'react';
import { Minus, Plus, ThermometerSun } from 'lucide-react';

interface CalendarControlsProps {
  scale: number;
  showTemperatures: boolean;
  onScaleChange: (scale: number) => void;
  onToggleTemperatures: () => void;
}

export const CalendarControls: React.FC<CalendarControlsProps> = ({
  scale,
  showTemperatures,
  onScaleChange,
  onToggleTemperatures
}) => {
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => onScaleChange(Math.max(0.5, scale - 0.1))}
        className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
      >
        <Minus className="w-5 h-5" />
      </button>
      
      <div className="text-sm text-gray-400">
        {Math.round(scale * 100)}%
      </div>
      
      <button
        onClick={() => onScaleChange(Math.min(2, scale + 0.1))}
        className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
      >
        <Plus className="w-5 h-5" />
      </button>

      <button
        onClick={onToggleTemperatures}
        className={`p-2 rounded-lg transition-colors ${
          showTemperatures 
            ? 'bg-indigo-500 text-white hover:bg-indigo-600' 
            : 'bg-gray-700 hover:bg-gray-600'
        }`}
      >
        <ThermometerSun className="w-5 h-5" />
      </button>
    </div>
  );
};