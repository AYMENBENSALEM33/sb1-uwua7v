import React from 'react';
import { Event } from '../../../models/Event';
import { EventItem } from './EventItem';
import { generateComponentKey } from '../../../utils/idGenerator';

interface EventListProps {
  events: Event[];
  onEditEvent: (event: Event) => void;
}

export const EventList: React.FC<EventListProps> = ({ events, onEditEvent }) => {
  if (events.length === 0) {
    return (
      <div className="border-t border-gray-200">
        <p className="text-center text-gray-500 py-4">
          No events in this series
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200">
      <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
        {events.map(event => (
          <EventItem
            key={generateComponentKey(`event-${event.id}`)}
            event={event}
            onEdit={() => onEditEvent(event)}
          />
        ))}
      </div>
    </div>
  );
};

export default EventList;