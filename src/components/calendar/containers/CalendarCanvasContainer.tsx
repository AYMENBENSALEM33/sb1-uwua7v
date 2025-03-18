import React, { useRef, useEffect } from 'react';
import { useCalendarStore } from '../../../store/calendarStore';
import { useCalendarRenderer } from '../hooks/useCalendarRenderer';
import { CalendarCanvas } from '../presentational';
import { calculateGrid } from '../utils/grid';

const CalendarCanvasContainer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { events, config, selectedArc } = useCalendarStore();
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useCalendarRenderer(canvasRef);

  // Calculate grid once when config changes
  const grid = React.useMemo(() => calculateGrid(config), [config]);

  return (
    <CalendarCanvas
      width={config.width}
      height={config.height}
      grid={grid}
      events={events}
      selectedArc={selectedArc}
      config={config}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
};

export default CalendarCanvasContainer;