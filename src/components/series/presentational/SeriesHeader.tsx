import React from 'react';
import { Plus, Upload, Trash2 } from 'lucide-react';
import { DateRangeSyncButton } from '../../common/DateRangeSyncButton';

interface SeriesHeaderProps {
  onImport: () => void;
  onClearAll: () => void;
  onAddSeries: () => void;
}

export const SeriesHeader: React.FC<SeriesHeaderProps> = ({
  onImport,
  onClearAll,
  onAddSeries
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-800">
        Event Series Management
      </h2>
      <div className="flex space-x-2">
        <DateRangeSyncButton />
        
        <button
          onClick={onClearAll}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear All</span>
        </button>
        
        <button
          onClick={onImport}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <Upload className="w-4 h-4" />
          <span>Import</span>
        </button>
        
        <button
          onClick={onAddSeries}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Series</span>
        </button>
      </div>
    </div>
  );
};

export default SeriesHeader;