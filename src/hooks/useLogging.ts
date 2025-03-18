import { useCallback } from 'react';
import { logger } from '../services/api/logger';
import { useSyncLogsStore } from '../store/syncLogsStore';

export function useLogging(componentName: string) {
  const { addLog } = useSyncLogsStore();

  const log = useCallback((type: 'info' | 'success' | 'warning' | 'error', message: string, data?: any) => {
    const formattedMessage = data ? `${message}\n${JSON.stringify(data, null, 2)}` : message;
    
    // Log through singleton logger
    logger[type](`[${componentName}] ${formattedMessage}`);
    
    // Add to store if needed
    if (addLog) {
      addLog({
        message: `[${componentName}] ${formattedMessage}`,
        type,
      });
    }
  }, [componentName, addLog]);

  return {
    info: useCallback((message: string, data?: any) => log('info', message, data), [log]),
    success: useCallback((message: string, data?: any) => log('success', message, data), [log]),
    warning: useCallback((message: string, data?: any) => log('warning', message, data), [log]),
    error: useCallback((message: string, data?: any) => log('error', message, data), [log])
  };
}