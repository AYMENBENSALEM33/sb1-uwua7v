import { useState, useCallback } from 'react';
import { useEventStore } from '../store/eventStore';
import { useSeriesStore } from '../store/seriesStore';
import { LoggerService } from '../services/api/logger';
import { toISODateString } from '../utils/dateUtils';

const logger = new LoggerService();

export const useCalendarEvents = () => {
  const { addEvent } = useEventStore();
  const { series } = useSeriesStore();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEventFromDates = useCallback(async (startDate: Date, endDate: Date, seriesId: number) => {
    setError(null);
    setIsCreating(true);

    try {
      const selectedSeries = series.find(s => s.id === seriesId);
      if (!selectedSeries) {
        throw new Error('Selected series not found');
      }

      logger.info('Creating event from calendar', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        seriesId
      });

      const newEvent = {
        name: `Event ${new Date().toLocaleDateString()}`,
        startDate: toISODateString(startDate),
        endDate: toISODateString(endDate),
        color: selectedSeries.colors.default,
        value: 0,
        position: selectedSeries.positions.default,
        seriesId: selectedSeries.id,
        visible: true,
        type: ''
      };

      await addEvent(newEvent);
      logger.success('Event created successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create event';
      logger.error(`Error creating event: ${message}`);
      setError(message);
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, [addEvent, series]);

  return {
    createEventFromDates,
    isCreating,
    error
  };
};