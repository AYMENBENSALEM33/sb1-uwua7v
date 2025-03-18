import React, { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { DateRangePicker } from '../common/DateRangePicker';
import { AddEventModal } from './AddEventModal';
import { useEventSync } from '../../hooks/useEventSync';

export const EventsHeader = () => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const { syncEventsForDateRange, isLoading } = useEventSync();

  const handleSync = async (startDate: Date, endDate: Date) => {
    await syncEventsForDateRange(startDate, endDate);
    setIsDatePickerOpen(false);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold neon-text">Events</h2>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setIsEventModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Event</span>
        </button>

        <button
          onClick={() => setIsDatePickerOpen(true)}
          disabled={isLoading}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            isLoading
              ? 'bg-gray-800/50 cursor-not-allowed'
              : 'bg-violet-500/20 hover:bg-violet-500/30'
          }`}
        >
          <Calendar className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Syncing...' : 'Sync Period'}</span>
        </button>
      </div>

      <DateRangePicker
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onSubmit={handleSync}
        title="Select Period to Sync"
      />

      <AddEventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />
    </div>
  );
};