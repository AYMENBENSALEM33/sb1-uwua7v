import { Event } from '../models/Event';
import { LoggerService } from '../services/api/logger';

const logger = new LoggerService();

export class EventValidator {
  static async validateAndLogEvent(event: Partial<Event>): Promise<boolean> {
    logger.logDataValidation(event, 'Event');
    
    const errors = this.validateEvent(event);
    
    if (errors.length > 0) {
      logger.warning(`Event validation failed`, {
        event: {
          id: event.id,
          name: event.name
        },
        errors
      });
      return false;
    }

    if (event.seriesId) {
      logger.debug(`Validating series reference`, {
        eventId: event.id,
        seriesId: event.seriesId
      });
    }
    
    return true;
  }

  // ... rest of the implementation stays the same
}