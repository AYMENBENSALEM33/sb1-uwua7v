import { useState, useCallback } from 'react';
import { useEventStore } from '../store/eventStore';
import { useSeriesStore } from '../store/seriesStore';
import { eventSyncService } from '../services/sync/eventSyncService';
import { LoggerService } from '../services/api/logger';

const logger = new LoggerService();

export const useEventSync = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loadEvents } = useEventStore();
  const { loadSeries } = useSeriesStore();

  const syncEventsForDateRange = useCallback(async (startDate: Date, endDate: Date) => {
    setIsLoading(true);
    setError(null);

    try {
      logger.info('Starting sync process');

      // Load series first to ensure we have all references
      await loadSeries();
      logger.info('Series loaded');

      // Perform sync
      await eventSyncService.syncEventsForDateRange(startDate, endDate);
      
      // Reload data to update UI
      await loadEvents();
      
      logger.success('Sync completed successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Sync failed: ${message}`);
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [loadEvents, loadSeries]);

  return {
    isLoading,
    error,
    syncEventsForDateRange
  };
};