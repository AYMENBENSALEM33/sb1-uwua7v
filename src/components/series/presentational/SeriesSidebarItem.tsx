import React from 'react';
import { ChevronRight, Plus } from 'lucide-react';
import { Series } from '../../../models/Series';
import { useEventStore } from '../../../store/eventStore';
import { SeriesEventsList } from './SeriesEventsList';

interface SeriesSidebarItemProps {
  series: Series;
  isExpanded: boolean;
  onToggle: () => void;
  onAddEvent: () => void;
}

export const SeriesSidebarItem: React.FC<SeriesSidebarItemProps> = ({
  series,
  isExpanded,
  onToggle,
  onAddEvent
}) => {
  const { events } = useEventStore();
  const seriesEvents = events.filter(e => e.seriesId === series.id);

  return (
    <div className="border border-gray-200 rounded-lg">
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: series.colors.default }}
          />
          <div>
            <h3 className="font-medium text-gray-900">{series.name}</h3>
            <p className="text-sm text-gray-500">
              {seriesEvents.length} event{seriesEvents.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddEvent();
            }}
            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
            title="Add event"
          >
            <Plus className="w-4 h-4" />
          </button>
          <ChevronRight 
            className={`w-4 h-4 transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}
          />
        </div>
      </div>

      {isExpanded && <SeriesEventsList events={seriesEvents} />}
    </div>
  );
};