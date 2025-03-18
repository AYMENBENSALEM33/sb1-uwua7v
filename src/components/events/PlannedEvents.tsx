import React from 'react';
import { useEventStore } from '../../store/eventStore';
import { EventCard } from './EventCard';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const PlannedEvents = () => {
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

  // Filter and sort planned events (events with dates)
  const plannedEvents = events
    .filter(event => event.startDate && event.endDate)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  if (plannedEvents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No planned events
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {plannedEvents.map(event => (
        <EventCard
          key={event.id}
          event={event}
          className="bg-white/5"
        />
      ))}
    </div>
  );
};