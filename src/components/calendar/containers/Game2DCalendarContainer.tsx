import React, { useCallback, useMemo } from 'react';
import { useEventStore } from '../../../store/eventStore';
import { useCalendarState } from '../hooks/useCalendarState';
import { Game2DCalendar } from '../presentational';
import { getCanvasCoordinates } from '../utils/coordinates';

const Game2DCalendarContainer: React.FC = () => {
  const { events } = useEventStore();
  const { config, updateZoom } = useCalendarState();

  // Memoize visible events to prevent unnecessary recalculations
  const visibleEvents = useMemo(() => {
    return events.filter(event => event.visible);
  }, [events]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e);
    // Handle mouse down logic
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e);
    // Handle mouse move logic
  }, []);

  const handleMouseUp = useCallback(() => {
    // Handle mouse up logic
  }, []);

  const handleZoomIn = useCallback(() => updateZoom(0.1), [updateZoom]);
  const handleZoomOut = useCallback(() => updateZoom(-0.1), [updateZoom]);

  return (
    <Game2DCalendar
      events={visibleEvents}
      config={config}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onZoomIn={handleZoomIn}
      onZoomOut={handleZoomOut}
    />
  );
};

export default Game2DCalendarContainer;