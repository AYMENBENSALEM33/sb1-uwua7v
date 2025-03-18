import { Event } from '../models/Event';
import { LoggerService } from '../services/api/logger';
import { seriesRepository } from '../db';

const logger = new LoggerService();

export interface ApiEvent {
  pmGuid: string;
  pmOrder: number;
  pmCreationDate: string;
  pmDescription: string;
}

class EventParser {
  async parseApiEvents(apiEvents: ApiEvent[]): Promise<Event[]> {
    logger.info("Processing " + apiEvents.length + " events");
    const validEvents: Event[] = [];

    for (const apiEvent of apiEvents) {
      try {
        const event = await this.parseApiEvent(apiEvent);
        if (event) {
          validEvents.push(event);
        }
      } catch (error) {
        logger.error("Failed to parse event: " + error);
      }
    }

    return validEvents;
  }

  private async parseApiEvent(apiEvent: ApiEvent): Promise<Event | null> {
    try {
      const eventData = JSON.parse(apiEvent.pmDescription);
      
      const seriesId = eventData.seriesId || 1;
      const series = await seriesRepository.findById(seriesId);
      
      if (!series) {
        logger.warning("Series " + seriesId + " not found for event");
        return null;
      }

      return {
        id: Date.now(),
        name: eventData.name || "Untitled Event",
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        color: eventData.color || series.colors.default,
        visible: true,
        position: eventData.position || series.positions.default,
        seriesId: series.id,
        type: eventData.type || "",
        value: eventData.value || 0,
        createdAt: apiEvent.pmCreationDate,
        updatedAt: apiEvent.pmCreationDate
      };
    } catch (error) {
      logger.error("Error parsing event: " + error);
      return null;
    }
  }
}

export const eventParser = new EventParser();