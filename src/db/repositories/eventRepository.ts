import { Event } from '../../models/Event';
import { getDB } from '../connection';
import { EventValidator } from '../../utils/validation';
import { LoggerService } from '../../services/api/logger';

const logger = new LoggerService();

export class EventRepository {
  async create(event: Event): Promise<Event> {
    const db = await getDB();
    const tx = db.transaction('events', 'readwrite');
    
    try {
      // Validate event before creation
      const isValid = await EventValidator.validateAndLogEvent(event);
      if (!isValid) {
        throw new Error('Invalid event data');
      }

      const existing = await tx.store.get(event.id);
      if (existing) {
        logger.info(`Event ${event.id} already exists, skipping creation`);
        await tx.done;
        return existing;
      }

      await tx.store.put(event);
      await tx.done;
      logger.info(`Event ${event.id} (${event.name}) created successfully`);
      return event;
    } catch (error) {
      logger.error(`Failed to create event ${event.id}: ${error}`);
      throw error;
    }
  }

  async update(id: number, event: Partial<Event>): Promise<void> {
    const db = await getDB();
    const tx = db.transaction('events', 'readwrite');
    
    try {
      const existing = await tx.store.get(id);
      if (!existing) {
        throw new Error(`Event ${id} not found`);
      }

      const updatedEvent = {
        ...existing,
        ...event,
        updatedAt: new Date().toISOString()
      };

      // Validate updated event
      const isValid = await EventValidator.validateAndLogEvent(updatedEvent);
      if (!isValid) {
        throw new Error('Invalid event data');
      }

      await tx.store.put(updatedEvent);
      await tx.done;
      logger.info(`Event ${id} updated successfully`);
    } catch (error) {
      logger.error(`Failed to update event ${id}: ${error}`);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    const db = await getDB();
    const tx = db.transaction('events', 'readwrite');
    
    try {
      await tx.store.delete(id);
      await tx.done;
      logger.info(`Event ${id} deleted successfully`);
    } catch (error) {
      logger.error(`Failed to delete event ${id}: ${error}`);
      throw error;
    }
  }

  async findById(id: number): Promise<Event | undefined> {
    const db = await getDB();
    try {
      const event = await db.get('events', id);
      if (!event) {
        logger.info(`Event ${id} not found`);
      }
      return event;
    } catch (error) {
      logger.error(`Failed to find event ${id}: ${error}`);
      throw error;
    }
  }

  async findAll(): Promise<Event[]> {
    const db = await getDB();
    try {
      const events = await db.getAll('events');
      logger.info(`Retrieved ${events.length} events`);
      return events;
    } catch (error) {
      logger.error('Failed to retrieve events:', error);
      throw error;
    }
  }

  async findBySeriesId(seriesId: number): Promise<Event[]> {
    const db = await getDB();
    const tx = db.transaction('events', 'readonly');
    
    try {
      const events = await tx.store.index('by-series').getAll(seriesId);
      logger.info(`Retrieved ${events.length} events for series ${seriesId}`);
      return events;
    } catch (error) {
      logger.error(`Failed to retrieve events for series ${seriesId}: ${error}`);
      throw error;
    }
  }

  async findBetweenDates(startDate: Date, endDate: Date): Promise<Event[]> {
    const db = await getDB();
    const tx = db.transaction('events', 'readonly');
    
    try {
      const events = await tx.store.getAll();
      const filteredEvents = events.filter(event => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        return eventStart >= startDate && eventEnd <= endDate;
      });
      
      logger.info(`Retrieved ${filteredEvents.length} events between ${startDate.toISOString()} and ${endDate.toISOString()}`);
      return filteredEvents;
    } catch (error) {
      logger.error('Failed to retrieve events between dates:', error);
      throw error;
    }
  }

  async deleteAll(): Promise<void> {
    const db = await getDB();
    const tx = db.transaction('events', 'readwrite');
    
    try {
      await tx.store.clear();
      await tx.done;
      logger.info('All events deleted successfully');
    } catch (error) {
      logger.error('Failed to delete all events:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const eventRepository = new EventRepository();