import { useCallback, useRef } from 'react';
import { useCalendarStore } from '../../../store/calendarStore';
import { Point } from '../types';

export const useCalendarDrag = () => {
  const dragStartRef = useRef<Point | null>(null);
  const { updateEventPosition } = useCalendarStore();

  const handleDragMove = useCallback((point: Point, eventId: number) => {
    if (!dragStartRef.current) return;

    const dy = point.y - dragStartRef.current.y;
    const sensitivity = 0.3;
    const positionDelta = Math.round(dy * sensitivity / 30);
    
    updateEventPosition(eventId, positionDelta);
  }, [updateEventPosition]);

  const startDrag = useCallback((point: Point) => {
    dragStartRef.current = point;
  }, []);

  const endDrag = useCallback(() => {
    dragStartRef.current = null;
  }, []);

  return {
    handleDragMove,
    startDrag,
    endDrag
  };
};