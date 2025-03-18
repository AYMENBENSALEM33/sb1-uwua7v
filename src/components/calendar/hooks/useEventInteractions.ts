import { useState, useCallback } from 'react';
import { Event } from '../../../models/Event';
import { Point } from '../types';
import { LoggerService } from '../../../services/api/logger';
import { findEventAtPosition } from '../utils/eventDetection';
import { CalendarConfig } from '../types';

const logger = new LoggerService();

export function useEventInteractions(config: CalendarConfig) {
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState<Point | null>(null);

  const handleMouseMove = useCallback((point: Point, events: Event[]) => {
    if (isDragging) return;

    const event = findEventAtPosition(point, events, config);
    if (event !== hoveredEvent) {
      setHoveredEvent(event);
      logger.info(event ? `Hovering event: ${event.name}` : 'No event hovered');
    }
  }, [isDragging, hoveredEvent, config]);

  const handleDragStart = useCallback((point: Point) => {
    setIsDragging(true);
    setDragStartPos(point);
    logger.info(`Drag started at (${point.x}, ${point.y})`);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragStartPos(null);
    logger.info('Drag ended');
  }, []);

  return {
    hoveredEvent,
    isDragging,
    dragStartPos,
    handleMouseMove,
    handleDragStart,
    handleDragEnd
  };
}