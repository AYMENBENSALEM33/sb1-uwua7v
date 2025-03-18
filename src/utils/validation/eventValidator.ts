import { Event } from '../../models/Event';
import { LoggerService } from '../../services/api/logger';
import { ValidationResult } from './types';
import { toISODateString } from '../dateUtils';

const logger = new LoggerService();

export class EventValidator {
  static validateEvent(event: Partial<Event>): ValidationResult {
    const errors: string[] = [];

    try {
      // Log validation start
      logger.info('Starting event validation', {
        eventName: event.name,
        seriesId: event.seriesId
      });

      // Required fields
      if (!event.name?.trim()) errors.push('Name is required');
      if (!event.startDate) errors.push('Start date is required');
      if (!event.endDate) errors.push('End date is required');
      if (!event.seriesId) errors.push('Series ID is required');

      // Date validation
      if (event.startDate && event.endDate) {
        try {
          const start = new Date(event.startDate);
          const end = new Date(event.endDate);
          
          if (isNaN(start.getTime())) {
            errors.push('Invalid start date format');
          }
          if (isNaN(end.getTime())) {
            errors.push('Invalid end date format');
          }
          if (start > end) {
            errors.push('Start date must be before or equal to end date');
          }
        } catch (error) {
          errors.push('Invalid date format');
        }
      }

      // Position validation
      if (event.position !== undefined) {
        if (!Number.isInteger(event.position) || event.position < 1 || event.position > 5) {
          errors.push('Position must be between 1 and 5');
        }
      }

      // Value validation
      if (event.value !== undefined) {
        if (typeof event.value !== 'number' || isNaN(event.value)) {
          errors.push('Value must be a valid number');
        }
      }

      // Color validation
      if (event.color && !/^#[0-9A-Fa-f]{6}$/.test(event.color)) {
        errors.push('Color must be a valid hex color code');
      }

      const isValid = errors.length === 0;

      // Log validation result
      if (isValid) {
        logger.info('Event validation successful', {
          eventName: event.name,
          seriesId: event.seriesId,
          startDate: event.startDate ? toISODateString(new Date(event.startDate)) : undefined,
          endDate: event.endDate ? toISODateString(new Date(event.endDate)) : undefined
        });
      } else {
        logger.warning('Event validation failed', { 
          eventName: event.name,
          errors 
        });
      }

      return { isValid, errors };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown validation error';
      logger.error(`Validation error: ${message}`);
      return { 
        isValid: false, 
        errors: [message]
      };
    }
  }
}