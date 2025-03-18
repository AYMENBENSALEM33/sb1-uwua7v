import { useState, useCallback } from 'react';
import { useEventStore } from '../store/eventStore';
import { serviceDeskApi } from '../services/api/serviceDeskApi';
import { LoggerService } from '../services/api/logger';

const logger = new LoggerService();

export const useDiagnostics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { events } = useEventStore();

  const handleError = useCallback((error: unknown) => {
    const message = error instanceof Error ? error.message : 'An error occurred';
    setError(message);
    logger.error(message);
  }, []);

  const handleTest = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const isConnected = await serviceDeskApi.testConnection();
      if (!isConnected) {
        throw new Error('Connection test failed');
      }
      logger.success('Connection test successful');
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const handleDownload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1); // Last month
      const endDate = new Date();
      
      await serviceDeskApi.getEvents(startDate, endDate);
      logger.success('Events downloaded successfully');
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const handleSync = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await serviceDeskApi.syncEvents(events);
      logger.success('Events synced successfully');
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, [events, handleError]);

  return {
    isLoading,
    error,
    handleTest,
    handleDownload,
    handleSync
  };
};