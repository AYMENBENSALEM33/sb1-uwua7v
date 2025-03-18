import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface CalendarControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const CalendarControls: React.FC<CalendarControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut
}) => (
  <div className="flex items-center space-x-4 mb-4">
    <button
      onClick={onZoomOut}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      <Minus className="w-5 h-5" />
    </button>
    
    <div className="text-sm text-gray-600">
      {Math.round(zoom * 100)}%
    </div>
    
    <button
      onClick={onZoomIn}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      <Plus className="w-5 h-5" />
    </button>
  </div>
);

export default CalendarControls;