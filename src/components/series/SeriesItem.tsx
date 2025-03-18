import React, { useCallback } from 'react';
import { Eye, EyeOff, ChevronRight, Plus, Trash2, GripVertical } from 'lucide-react';
import { useEventStore } from '../../store/eventStore';
import SeriesEvents from './SeriesEvents';
import { generateComponentKey } from '../../utils/idGenerator';
import { Series } from '../../models/Series';
import { Event } from '../../models/Event';

interface SeriesItemProps {
  series: Series;
  isSelected: boolean;
  onSelect: () => void;
  onAddEvent: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  isDraggedOver: boolean;
  events: Event[];
  onEditEvent: (event: Event) => void;
}

const SeriesItem: React.FC<SeriesItemProps> = ({
  series,
  isSelected,
  onSelect,
  onAddEvent,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  isDraggedOver,
  events,
  onEditEvent
}) => {
  const { toggleVisibility } = useEventStore();

  const defaultColor = series.colors?.default || '#000000';
  const totalValue = events.reduce((sum, event) => sum + event.value, 0);
  const isVisible = events.some(event => event.visible);

  const handleToggleVisibility = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    events.forEach(event => {
      if (event.visible !== !isVisible) {
        toggleVisibility(event.id);
      }
    });
  }, [events, isVisible, toggleVisibility]);

  return (
    <div 
      key={generateComponentKey(`series-${series.id}`)}
      className={`border border-gray-200 rounded-lg transition-all ${
        isDraggedOver ? 'border-indigo-500 transform scale-102' : ''
      }`}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50">
        <div 
          className="flex items-center space-x-3 flex-1"
          onClick={onSelect}
        >
          <div className="cursor-move">
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: defaultColor }}
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-gray-900">{series.name}</h3>
              {totalValue !== 0 && (
                <span className={`text-sm font-medium ${
                  totalValue > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ({totalValue.toFixed(2)})
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {series.description || `${events.length} événement(s)`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleVisibility}
            className={`p-2 rounded-lg transition-colors ${
              isVisible
                ? 'text-green-600 hover:bg-green-50'
                : 'text-gray-400 hover:bg-gray-50'
            }`}
          >
            {isVisible ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddEvent();
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
          {series.isCustom && (
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <ChevronRight 
            className={`w-5 h-5 transition-transform ${
              isSelected ? 'rotate-90' : ''
            }`}
          />
        </div>
      </div>

      {isSelected && (
        <SeriesEvents
          categoryId={series.id.toString()}
          events={events}
          onEditEvent={onEditEvent}
        />
      )}
    </div>
  );
};

export default React.memo(SeriesItem);