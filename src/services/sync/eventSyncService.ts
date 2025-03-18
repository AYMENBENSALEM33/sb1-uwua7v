import { Event } from '../../models/Event';
import { serviceDeskApi } from '../api/serviceDeskApi';
import { eventRepository } from '../../db';
import { LoggerService } from '../api/logger';
import { cacheService } from '../cache';
import { toISODateString } from '../../utils/dateUtils';

const logger = new LoggerService();

export class EventSyncService {
  async syncEventsForDateRange(startDate: Date, endDate: Date): Promise<void> {
    try {
      logger.info('Starting event sync', {
        startDate: toISODateString(startDate),
        endDate: toISODateString(endDate)
      });

      // Clear cache before sync
      cacheService.clear();

      // Fetch events from API
      const apiEvents = await serviceDeskApi.getEvents(startDate, endDate);
      logger.info(`Retrieved ${apiEvents.length} events from API`);

      // Get existing events for the date range
      const existingEvents = await eventRepository.findBetweenDates(startDate, endDate);
      logger.info(`Found ${existingEvents.length} existing events in date range`);

      const existingEventsMap = new Map(existingEvents.map(e => [e.id, e]));
      const apiEventsMap = new Map(apiEvents.map(e => [e.id, e]));

      let created = 0;
      let updated = 0;
      let deleted = 0;
      let unchanged = 0;

      // Process API events
      for (const apiEvent of apiEvents) {
        const existingEvent = existingEventsMap.get(apiEvent.id);

        if (!existingEvent) {
          // Create new event
          await eventRepository.create({
            ...apiEvent,
            startDate: toISODateString(new Date(apiEvent.startDate)),
            endDate: toISODateString(new Date(apiEvent.endDate)),
            updatedAt: new Date().toISOString()
          });
          created++;
          logger.info(`Created new event: ${apiEvent.name}`);
        } else {
          // Check if update needed
          const apiEventDate = new Date(apiEvent.updatedAt);
          const existingEventDate = new Date(existingEvent.updatedAt);

          if (apiEventDate > existingEventDate) {
            await eventRepository.update(apiEvent.id, {
              ...apiEvent,
              startDate: toISODateString(new Date(apiEvent.startDate)),
              endDate: toISODateString(new Date(apiEvent.endDate)),
              updatedAt: new Date().toISOString()
            });
            updated++;
            logger.info(`Updated event: ${apiEvent.name}`);
          } else {
            unchanged++;
          }
        }
      }

      // Delete local events that no longer exist in API
      for (const existingEvent of existingEvents) {
        if (!apiEventsMap.has(existingEvent.id)) {
          await eventRepository.delete(existingEvent.id);
          deleted++;
          logger.info(`Deleted event: ${existingEvent.name}`);
        }
      }

      logger.success(`Sync completed successfully:
        - Created: ${created}
        - Updated: ${updated}
        - Deleted: ${deleted}
        - Unchanged: ${unchanged}
        - Total API events: ${apiEvents.length}
        - Total local events: ${existingEvents.length}`);

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Sync failed: ${message}`);
      throw error;
    }
  }
}

export const eventSyncService = new EventSyncService();