import { ParsedEventData } from './types';
import { LoggerService } from '../../services/api/logger';

const logger = new LoggerService();

export function validateEventData(data: ParsedEventData): boolean {
  if (!data.name || !data.startDate || !data.endDate) {
    logger.error("Missing required event fields");
    return false;
  }

  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    logger.error("Invalid date format");
    return false;
  }

  if (start > end) {
    logger.error("Start date cannot be after end date");
    return false;
  }

  return true;
}