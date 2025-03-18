import React from 'react';
import { Plus } from 'lucide-react';

interface SeriesSidebarHeaderProps {
  onAddSeries: () => void;
}

export const SeriesSidebarHeader: React.FC<SeriesSidebarHeaderProps> = ({ onAddSeries }) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Event Series</h2>
        <button
          onClick={onAddSeries}
          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="Add new series"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};