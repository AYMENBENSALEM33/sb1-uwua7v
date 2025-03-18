import { useCallback } from 'react';
import { useCalendarStore } from '../../../store/calendarStore';
import { Point } from '../types';

export const useCalendarEvents = () => {
  const { setSelectedArc, setIsDragging } = useCalendarStore();

  const handleEventSelection = useCallback((point: Point) => {
    // Event selection logic
  }, [setSelectedArc]);

  const handleDragStart = useCallback((point: Point) => {
    setIsDragging(true);
  }, [setIsDragging]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, [setIsDragging]);

  return {
    handleEventSelection,
    handleDragStart,
    handleDragEnd
  };
};