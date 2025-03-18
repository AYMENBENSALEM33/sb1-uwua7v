import React, { useRef, memo } from 'react';
import { Arc } from './types';
import { useCanvasRenderer } from './hooks/useCanvasRenderer';

interface CalendarCanvasProps {
  width: number;
  height: number;
  events: any[];
  selectedArc: Arc | null;
  config: {
    centerX: number;
    centerY: number;
    baseRadius: number;
    zoom: number;
    yearRange: number;
  };
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
}

const CalendarCanvas: React.FC<CalendarCanvasProps> = ({
  width,
  height,
  events,
  selectedArc,
  config,
  onMouseDown,
  onMouseMove,
  onMouseUp
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Setup renderer with memoized dependencies
  useCanvasRenderer(canvasRef, {
    ...config,
    width,
    height
  }, events, selectedArc);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border border-gray-200 rounded-lg shadow-lg cursor-grab active:cursor-grabbing"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    />
  );
};

// Prevent unnecessary re-renders
export default memo(CalendarCanvas);