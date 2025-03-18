import React from 'react';
import { Event } from '../../../models/Event';
import { generateComponentKey } from '../../../utils/idGenerator';

interface SeriesEventsListProps {
  events: Event[];
}

export const SeriesEventsList: React.FC<SeriesEventsListProps> = ({ events }) => {
  if (events.length === 0) {
    return (
      <div className="border-t border-gray-200 p-3 text-center text-gray-500 text-sm">
        No events in this series
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200">
      <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
        {events.map(event => (
          <div
            key={generateComponentKey(`event-${event.id}`)}
            className="px-3 py-2 rounded-lg hover:bg-gray-50"
          >
            <div className="font-medium text-sm">{event.name}</div>
            <div className="text-xs text-gray-500">
              {new Date(event.startDate).toLocaleDateString()}
              {event.startDate !== event.endDate && 
                ` - ${new Date(event.endDate).toLocaleDateString()}`
              }
              {event.value !== 0 && (
                <span className={`ml-2 font-medium ${
                  event.value > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ({event.value > 0 ? '+' : ''}{event.value.toFixed(2)})
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};