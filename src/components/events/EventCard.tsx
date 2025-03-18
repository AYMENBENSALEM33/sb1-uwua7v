import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Event } from '../../models/Event';
import { EventDetailsModal } from './EventDetailsModal';
import { AddEventModal } from './AddEventModal';
import { formatDate } from '../../utils/dateUtils';

interface EventCardProps {
  event: Event;
  className?: string;
}

export const EventCard: React.FC<EventCardProps> = ({ event, className = '' }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <div 
        className={`glassmorphism p-4 rounded-lg hover:scale-[1.02] transition-transform group cursor-pointer ${className}`}
        onClick={() => setIsDetailsOpen(true)}
      >
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-white group-hover:text-violet-400 transition-colors">
            {event.name}
          </h3>
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: event.color }}
          />
        </div>
        
        <div className="mt-2 space-y-1 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(event.startDate)}</span>
          </div>
          {event.startDate !== event.endDate && (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{formatDate(event.endDate)}</span>
            </div>
          )}
        </div>
        
        {event.value !== 0 && (
          <div className={`mt-2 text-sm font-medium ${
            event.value > 0 ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {event.value > 0 ? '+' : ''}{event.value.toFixed(2)}
          </div>
        )}
      </div>

      <EventDetailsModal
        event={event}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onEdit={() => {
          setIsDetailsOpen(false);
          setIsEditOpen(true);
        }}
      />

      <AddEventModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        editingEvent={event}
      />
    </>
  );
};