import { useEffect } from 'react';
import { LoggerService } from '../services/api/logger';
import { Event } from '../models/Event';
import { Series } from '../models/Series';

const logger = new LoggerService();

export function useComponentValidation(
  componentName: string,
  events: Event[],
  series: Series[]
) {
  useEffect(() => {
    logger.info(`${componentName} received:
- ${events.length} events
- ${series.length} series`);

    // Log series details
    series.forEach(s => {
      const seriesEvents = events.filter(e => e.seriesId === s.id);
      logger.info(`Series "${s.name}": ${seriesEvents.length} events`);
    });

    // Check for events without valid series
    const invalidEvents = events.filter(
      e => !series.find(s => s.id === e.seriesId)
    );
    
    if (invalidEvents.length > 0) {
      logger.warning(`Found ${invalidEvents.length} events with invalid series references`);
    }
  }, [componentName, events, series]);
}

export function useRenderValidation(componentName: string) {
  return {
    logRender: (message: string) => {
      logger.info(`[${componentName}] ${message}`);
    },
    logError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`[${componentName}] Render error: ${message}`);
    }
  };
}