import React, { useCallback } from 'react';
import { useEventStore, Event } from '../../store/eventStore';
import EventItem from './EventItem';
import { generateComponentKey } from '../../utils/idGenerator';

interface SeriesEventsProps {
  categoryId: string;
  events: Event[];
  onEditEvent: (event: Event) => void;
}

const SeriesEvents: React.FC<SeriesEventsProps> = ({ categoryId, events, onEditEvent }) => {
  const { deleteEvent, toggleVisibility } = useEventStore();

  const handleDeleteEvent = useCallback((event: Event) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      deleteEvent(event.id);
    }
  }, [deleteEvent]);

  if (events.length === 0) {
    return (
      <div className="border-t border-gray-200">
        <p className="text-center text-gray-500 py-4">
          Aucun événement dans cette série
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
            onDelete={() => handleDeleteEvent(event)}
            onToggleVisibility={() => toggleVisibility(event.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(SeriesEvents);