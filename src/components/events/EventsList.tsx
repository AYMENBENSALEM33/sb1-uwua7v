import React from 'react';
import { useEventStore } from '../../store/eventStore';
import { EventCard } from './EventCard';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const EventsList = () => {
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

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No events available
      </div>
    );
  }

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    return dateA - dateB;
  });

  return (
    <div className="space-y-3">
      {sortedEvents.map(event => (
        <EventCard
          key={event.id}
          event={event}
          className="bg-white/5"
        />
      ))}
    </div>
  );
};