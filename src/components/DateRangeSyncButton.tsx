import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { useEventSync } from '../hooks/useEventSync';
import DateRangePicker from './DateRangePicker';

export const DateRangeSyncButton: React.FC = () => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const { isLoading, error, syncEventsForDateRange } = useEventSync();

  const handleSync = async (startDate: Date, endDate: Date) => {
    await syncEventsForDateRange(startDate, endDate);
    setIsDatePickerOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsDatePickerOpen(true)}
        disabled={isLoading}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
          isLoading
            ? 'bg-gray-100 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`}
      >
        <Calendar className="w-4 h-4" />
        <span>
          {isLoading ? 'Synchronisation...' : 'Synchroniser une période'}
        </span>
      </button>

      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <DateRangePicker
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onSubmit={handleSync}
        title="Sélectionner la période à synchroniser"
      />
    </>
  );
};