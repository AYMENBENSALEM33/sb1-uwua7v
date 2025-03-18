import React from 'react';
import { Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarControlsProps {
  scale: number;
  yearCount: number;
  startYear: number;
  onScaleChange: (scale: number) => void;
  onYearAdd: () => void;
  onYearRemove: () => void;
  onStartYearChange: (year: number) => void;
}

export const CalendarControls: React.FC<CalendarControlsProps> = ({
  scale,
  yearCount,
  startYear,
  onScaleChange,
  onYearAdd,
  onYearRemove,
  onStartYearChange
}) => {
  return (
    <div className="flex items-center space-x-8">
      {/* Zoom controls */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onScaleChange(Math.max(0.5, scale - 0.1))}
          disabled={scale <= 0.5}
          className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus className="w-5 h-5 text-violet-400 group-hover:text-violet-300" />
        </button>
        
        <div className="text-sm text-violet-400 font-medium min-w-[4rem] text-center">
          {Math.round(scale * 100)}%
        </div>
        
        <button
          onClick={() => onScaleChange(Math.min(2, scale + 0.1))}
          disabled={scale >= 2}
          className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5 text-violet-400 group-hover:text-violet-300" />
        </button>
      </div>

      {/* Year controls */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onStartYearChange(startYear - 1)}
          className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 text-violet-400 group-hover:text-violet-300" />
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-violet-400 font-medium min-w-[8rem] text-center">
            {startYear} - {startYear + yearCount - 1}
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={onYearRemove}
              disabled={yearCount <= 1}
              className="p-1 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4 text-violet-400 group-hover:text-violet-300" />
            </button>
            <button
              onClick={onYearAdd}
              className="p-1 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors group"
            >
              <Plus className="w-4 h-4 text-violet-400 group-hover:text-violet-300" />
            </button>
          </div>
        </div>

        <button
          onClick={() => onStartYearChange(startYear + 1)}
          className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors group"
        >
          <ChevronRight className="w-5 h-5 text-violet-400 group-hover:text-violet-300" />
        </button>
      </div>
    </div>
  );
};