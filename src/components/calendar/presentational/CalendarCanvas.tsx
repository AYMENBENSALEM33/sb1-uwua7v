import React from 'react';
import { Arc, CalendarConfig } from '../types';

interface CalendarCanvasProps {
  width: number;
  height: number;
  events: any[];
  selectedArc: Arc | null;
  config: CalendarConfig;
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
  return (
    <canvas
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

export default React.memo(CalendarCanvas);