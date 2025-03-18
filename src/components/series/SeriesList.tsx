import React, { useState, useCallback } from 'react';
import { useSeriesStore } from '../../store/seriesStore';
import { useEventStore } from '../../store/eventStore';
import SeriesItem from './SeriesItem';
import { generateComponentKey } from '../../utils/idGenerator';

interface SeriesListProps {
  onEditEvent: (event: any) => void;
  onAddEvent: (seriesId: number) => void;
}

const SeriesList: React.FC<SeriesListProps> = ({ onEditEvent, onAddEvent }) => {
  const { series, deleteSeries, reorderSeries } = useSeriesStore();
  const { events } = useEventStore();
  const [selectedSeries, setSelectedSeries] = useState<number | null>(null);
  const [draggedSeries, setDraggedSeries] = useState<number | null>(null);
  const [dragOverSeries, setDragOverSeries] = useState<number | null>(null);

  const handleDeleteSeries = useCallback(async (seriesId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette série ? Tous les événements associés seront également supprimés.')) {
      await deleteSeries(seriesId);
    }
  }, [deleteSeries]);

  const handleDragStart = useCallback((e: React.DragEvent, seriesId: number) => {
    setDraggedSeries(seriesId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, seriesId: number) => {
    e.preventDefault();
    if (draggedSeries && draggedSeries !== seriesId) {
      setDragOverSeries(seriesId);
    }
  }, [draggedSeries]);

  const handleDrop = useCallback(async (e: React.DragEvent, seriesId: number) => {
    e.preventDefault();
    if (draggedSeries && draggedSeries !== seriesId) {
      await reorderSeries(draggedSeries, seriesId);
    }
    setDraggedSeries(null);
    setDragOverSeries(null);
  }, [draggedSeries, reorderSeries]);

  const getSeriesEvents = useCallback((seriesId: number) => {
    return events.filter(event => event.seriesId === seriesId);
  }, [events]);

  if (series.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune série d'événements disponible
      </div>
    );
  }

  return (
    <>
      {series.map(series => (
        <SeriesItem
          key={generateComponentKey(`series-${series.id}`)}
          series={series}
          isSelected={selectedSeries === series.id}
          onSelect={() => setSelectedSeries(selectedSeries === series.id ? null : series.id)}
          onAddEvent={() => onAddEvent(series.id)}
          onDelete={(e) => handleDeleteSeries(series.id, e)}
          onDragStart={(e) => handleDragStart(e, series.id)}
          onDragOver={(e) => handleDragOver(e, series.id)}
          onDrop={(e) => handleDrop(e, series.id)}
          isDraggedOver={dragOverSeries === series.id}
          events={getSeriesEvents(series.id)}
          onEditEvent={onEditEvent}
        />
      ))}
    </>
  );
};

export default React.memo(SeriesList);