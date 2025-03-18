import React from 'react';
import { SeriesItem } from './SeriesItem';
import { useSeriesStore } from '../../../store/seriesStore';
import { Series } from '../../../models/Series';
import { Event } from '../../../models/Event';
import { generateComponentKey } from '../../../utils/idGenerator';

interface SeriesListProps {
  onEditEvent: (event: Event) => void;
  onAddEvent: (seriesId: number) => void;
}

export const SeriesList: React.FC<SeriesListProps> = ({
  onEditEvent,
  onAddEvent
}) => {
  const { series } = useSeriesStore();
  const [selectedSeries, setSelectedSeries] = React.useState<number | null>(null);
  const [draggedSeries, setDraggedSeries] = React.useState<number | null>(null);
  const [draggedOverSeries, setDraggedOverSeries] = React.useState<number | null>(null);

  if (!series || series.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No event series available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {series.map(item => (
        <SeriesItem
          key={generateComponentKey(`series-${item.id}`)}
          series={item}
          isSelected={selectedSeries === item.id}
          onSelect={() => setSelectedSeries(selectedSeries === item.id ? null : item.id)}
          onAddEvent={() => onAddEvent(item.id)}
          onDelete={(e) => {
            e.stopPropagation();
            if (window.confirm('Are you sure you want to delete this series and all its events?')) {
              // Delete handler would go here
            }
          }}
          onDragStart={(e) => {
            setDraggedSeries(item.id);
            e.dataTransfer.effectAllowed = 'move';
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (draggedSeries && draggedSeries !== item.id) {
              setDraggedOverSeries(item.id);
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (draggedSeries && draggedSeries !== item.id) {
              // Reorder handler would go here
            }
            setDraggedSeries(null);
            setDraggedOverSeries(null);
          }}
          isDraggedOver={draggedOverSeries === item.id}
          events={[]} // This will be populated from the events store
          onEditEvent={onEditEvent}
        />
      ))}
    </div>
  );
};