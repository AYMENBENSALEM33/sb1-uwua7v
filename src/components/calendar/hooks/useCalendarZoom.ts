import { useCallback } from 'react';
import { useCalendarStore } from '../../../store/calendarStore';

export const useCalendarZoom = () => {
  const { updateZoom } = useCalendarStore();

  const handleZoomIn = useCallback(() => {
    updateZoom(0.1);
  }, [updateZoom]);

  const handleZoomOut = useCallback(() => {
    updateZoom(-0.1);
  }, [updateZoom]);

  return {
    handleZoomIn,
    handleZoomOut
  };
};