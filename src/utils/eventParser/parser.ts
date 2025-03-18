import { Event } from '../../models/Event';
import { ApiEvent } from './types';
import { seriesRepository } from '../../db';
import { LoggerService } from '../../services/api/logger';

const logger = new LoggerService();

export class EventParser {
  async parseApiEvents(apiEvents: ApiEvent[]): Promise<Event[]> {
    logger.info(`Starting to parse ${apiEvents.length} events`);
    const validEvents: Event[] = [];

    // Load all series first for validation
    const allSeries = await seriesRepository.findAll();
    const seriesMap = new Map(allSeries.map(s => [s.id, s]));

    for (const apiEvent of apiEvents) {
      try {
        const eventData = JSON.parse(apiEvent.pmDescription);
        const series = seriesMap.get(eventData.seriesId);

        if (!series) {
          logger.warning(`Invalid series ID ${eventData.seriesId} for event ${eventData.name}`);
          continue;
        }

        const event: Event = {
          id: parseInt(apiEvent.pmGuid),
          name: eventData.name,
          startDate: eventData.startDate,
          endDate: eventData.endDate,
          color: eventData.color || series.colors.default,
          visible: true,
          position: eventData.position || series.positions.default,
          seriesId: series.id,
          type: eventData.type || '',
          value: parseFloat(eventData.value) || 0,
          createdAt: apiEvent.pmCreationDate,
          updatedAt: apiEvent.pmCreationDate
        };

        validEvents.push(event);
        logger.info(`Successfully parsed event: ${event.name}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Failed to parse event: ${message}`);
      }
    }

    logger.success(`Successfully parsed ${validEvents.length} out of ${apiEvents.length} events`);
    return validEvents;
  }
}

export const eventParser = new EventParser();