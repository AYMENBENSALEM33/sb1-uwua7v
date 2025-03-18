import React from 'react';
import { useEventStore } from '../../store/eventStore';
import { EventCard } from './EventCard';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const BacklogEvents = () => {
  const { events, isLoading, error } = useEventStore();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
        {error}
      </div>
    );
  }

  // Filter backlog events (events without dates)
  const backlogEvents = events
    .filter(event => !event.startDate || !event.endDate)
    .sort((a, b) => b.id - a.id); // Most recent first

  if (backlogEvents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No events in backlog
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {backlogEvents.map(event => (
        <EventCard
          key={event.id}
          event={event}
          className="bg-white/5"
        />
      ))}
    </div>
  );
};