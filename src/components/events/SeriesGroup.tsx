import React, { useState } from 'react';
import { ChevronRight, Plus } from 'lucide-react';
import { Series } from '../../models/Series';
import { Event } from '../../models/Event';
import { EventCard } from './EventCard';
import { AddEventModal } from './AddEventModal';

interface SeriesGroupProps {
  series: Series;
  events: Event[];
}

export const SeriesGroup: React.FC<SeriesGroupProps> = ({ series, events }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const totalValue = events.reduce((sum, event) => sum + event.value, 0);

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <>
      <div className="glassmorphism rounded-lg overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-3 hover:text-violet-400 transition-colors"
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: series.colors.default }}
            />
            <div className="text-left">
              <h3 className="font-medium text-white">{series.name}</h3>
              <p className="text-sm text-gray-400">
                {events.length} event{events.length !== 1 ? 's' : ''}
              </p>
            </div>
          </button>

          <div className="flex items-center space-x-4">
            {totalValue !== 0 && (
              <span className={`text-sm font-medium ${
                totalValue > 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {totalValue > 0 ? '+' : ''}{totalValue.toFixed(2)}
              </span>
            )}
            
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="p-2 text-violet-400 hover:bg-violet-400/10 rounded-lg transition-colors"
              title="Add event"
            >
              <Plus className="w-5 h-5" />
            </button>

            <ChevronRight 
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isExpanded ? 'rotate-90' : ''
              }`}
            />
          </div>
        </div>

        {isExpanded && (
          <div className="p-4 pt-0 space-y-3 animate-slideIn">
            {sortedEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event}
                className="bg-white/5"
              />
            ))}
          </div>
        )}
      </div>

      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultSeriesId={series.id}
      />
    </>
  );
};