import { useCallback, useRef } from 'react';
import { LoggerService } from '../services/api/logger';

export function useCalendarLogging() {
  const loggerRef = useRef(new LoggerService());

  const logEvent = useCallback((message: string, data?: any) => {
    loggerRef.current.info(message, data);
  }, []);

  const logError = useCallback((error: unknown) => {
    const message = error instanceof Error ? error.message : 'Unknown error';
    loggerRef.current.error(message);
  }, []);

  return {
    logEvent,
    logError
  };
}