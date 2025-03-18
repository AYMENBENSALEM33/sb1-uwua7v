import { useState, useCallback } from 'react';
import { Arc, Point } from './types';
import { getCanvasCoordinates, findEventAtPosition } from './calendarUtils';

export function useCalendarEvents() {
  const [selectedArc, setSelectedArc] = useState<Arc | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState<Point | null>(null);
  const [currentMousePos, setCurrentMousePos] = useState<Point | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleEventClick = useCallback((event: any, timestamp: number) => {
    if (timestamp - lastClickTime < 300) {
      setSelectedEvent(event);
      setIsModalOpen(true);
    } else {
      setSelectedArc(event ? {
        id: event.id,
        // ... other arc properties
      } : null);
      setIsDragging(true);
    }
    setLastClickTime(timestamp);
  }, [lastClickTime]);

  return {
    selectedArc,
    isDragging,
    dragStartPos,
    currentMousePos,
    selectedEvent,
    isModalOpen,
    setIsModalOpen,
    handleEventClick,
    setIsDragging,
    setDragStartPos,
    setCurrentMousePos
  };
}