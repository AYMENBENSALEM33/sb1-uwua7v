import { useState, useCallback } from 'react';
import { useEventStore } from '../store/eventStore';
import { serviceDeskApi } from '../services/api/serviceDeskApi';
import { LoggerService } from '../services/api/logger';

const logger = new LoggerService();

export function useEventLoading() {
  const { loadEvents } = useEventStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async (startDate: Date, endDate: Date) => {
    setIsLoading(true);
    setError(null);

    try {
      logger.info('Fetching events for date range', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      const events = await serviceDeskApi.getEvents(startDate, endDate);
      await loadEvents();
      
      logger.success(`Successfully loaded ${events.length} events`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load events';
      logger.error(message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [loadEvents]);

  return {
    isLoading,
    error,
    fetchEvents
  };
}