import { useEffect } from 'react';
import { useEventStore } from '../store/eventStore';
import { useSeriesStore } from '../store/seriesStore';
import { LoggerService } from '../services/api/logger';

const logger = new LoggerService();

export const useInitialLoad = () => {
  const { loadEvents } = useEventStore();
  const { loadSeries } = useSeriesStore();

  useEffect(() => {
    const initializeData = async () => {
      try {
        logger.info('🔄 Loading initial data...');
        
        // Load series first since events depend on them
        await loadSeries();
        logger.info('✅ Series loaded');
        
        // Small delay to ensure series are fully loaded
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Then load events
        await loadEvents();
        logger.info('✅ Events loaded');
        
        logger.success('✅ Initialization complete');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`❌ Error during initial load: ${message}`);
      }
    };

    initializeData();
  }, [loadEvents, loadSeries]);
};