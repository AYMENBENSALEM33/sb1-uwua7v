import { Event } from '../../../models/Event';
import { Point } from '../types';
import { LoggerService } from '../../../services/api/logger';
import { calculateRadius, getDayAngle } from './coordinates';

const logger = new LoggerService();
const DRAG_THRESHOLD = 20;

export function findEventAtPosition(
  point: Point,
  events: Event[],
  config: { centerX: number; centerY: number; baseRadius: number; zoom: number }
): Event | null {
  try {
    const event = events.find(event => 
      isPointInEventBounds(point.x, point.y, event, config)
    );
    
    if (event) {
      logger.info(`Found event at position (${point.x}, ${point.y}): ${event.name}`);
    }
    return event || null;
  } catch (error) {
    logger.error(`Error finding event at position: ${error}`);
    return null;
  }
}

function isPointInEventBounds(
  x: number,
  y: number,
  event: Event,
  config: { centerX: number; centerY: number; baseRadius: number; zoom: number }
): boolean {
  const { centerX, centerY, baseRadius, zoom } = config;
  const year = new Date(event.startDate).getFullYear();
  const radius = calculateRadius(year, event.position - 1, baseRadius, zoom);
  
  // Calculate event arc angles
  const startDay = new Date(event.startDate).getDate();
  const endDay = new Date(event.endDate).getDate();
  const startAngle = getDayAngle(startDay);
  const endAngle = getDayAngle(endDay);
  
  // Calculate distance from center
  const dx = x - centerX;
  const dy = y - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Calculate angle of click point
  const angle = Math.atan2(dy, dx);
  
  // Check if point is within arc bounds
  return (
    Math.abs(distance - radius) <= DRAG_THRESHOLD &&
    angle >= startAngle &&
    angle <= endAngle
  );
}