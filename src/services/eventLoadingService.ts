import { Event } from '../models/Event';
import { eventRepository, seriesRepository } from '../db';
import { LoggerService } from './api/logger';
import { cacheService } from './cache';

const logger = new LoggerService();
const EVENTS_CACHE_KEY = 'events';
const DEFAULT_SERIES = {
  name: 'Default Series',
  description: 'Default series for uncategorized events',
  colors: { default: '#6366f1' },
  positions: { default: 1 },
  isCustom: false,
  order: 0
};

export class EventLoadingService {
  async loadEvents(): Promise<Event[]> {
    try {
      // Try cache first
      const cachedEvents = cacheService.get<Event[]>(EVENTS_CACHE_KEY);
      if (cachedEvents) {
        logger.info('Retrieved events from cache');
        return cachedEvents;
      }

      // Load or create default series
      const defaultSeries = await this.ensureDefaultSeries();
      logger.info(`Default series ID: ${defaultSeries.id}`);

      // Load all series
      const allSeries = await seriesRepository.findAll();
      const seriesMap = new Map(allSeries.map(s => [s.id, s]));

      // Load events
      logger.info('Loading events from repository');
      const events = await eventRepository.findAll();
      
      // Process events and assign default series if needed
      const processedEvents = await Promise.all(events.map(async event => {
        if (!seriesMap.has(event.seriesId)) {
          logger.warning(`Event ${event.id} (${event.name}) has invalid series ID: ${event.seriesId}, assigning to default series`);
          const updatedEvent = {
            ...event,
            seriesId: defaultSeries.id,
            color: defaultSeries.colors.default,
            position: defaultSeries.positions.default
          };
          await eventRepository.update(event.id, updatedEvent);
          return updatedEvent;
        }
        return event;
      }));

      // Sort events
      const sortedEvents = this.sortEvents(processedEvents);
      
      // Cache results
      cacheService.set(EVENTS_CACHE_KEY, sortedEvents);
      
      logger.success(`Loaded ${sortedEvents.length} events`);
      return sortedEvents;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to load events: ${message}`);
      throw error;
    }
  }

  private async ensureDefaultSeries() {
    try {
      // Try to find existing default series
      const allSeries = await seriesRepository.findAll();
      const defaultSeries = allSeries.find(s => !s.isCustom);
      
      if (defaultSeries) {
        return defaultSeries;
      }

      // Create default series if it doesn't exist
      logger.info('Creating default series');
      const now = new Date().toISOString();
      const newDefaultSeries = await seriesRepository.create({
        ...DEFAULT_SERIES,
        createdAt: now,
        updatedAt: now
      });

      logger.success('Default series created');
      return newDefaultSeries;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to ensure default series: ${message}`);
      throw error;
    }
  }

  private sortEvents(events: Event[]): Event[] {
    return events.sort((a, b) => {
      // First sort by series
      if (a.seriesId !== b.seriesId) {
        return a.seriesId - b.seriesId;
      }
      // Then by start date
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
  }
}

export const eventLoadingService = new EventLoadingService();