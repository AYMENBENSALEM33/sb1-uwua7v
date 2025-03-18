import React from 'react';
import CalendarControls from './CalendarControls';
import CalendarCanvas from './CalendarCanvas';
import { CalendarConfig } from '../types';

interface Game2DCalendarProps {
  events: any[];
  config: CalendarConfig;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const Game2DCalendar: React.FC<Game2DCalendarProps> = ({
  events,
  config,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onZoomIn,
  onZoomOut
}) => {
  return (
    <div className="flex flex-col items-center space-y-4 mt-8">
      <CalendarControls
        zoom={config.zoom}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
      />

      <CalendarCanvas
        width={config.width}
        height={config.height}
        events={events}
        selectedArc={null}
        config={config}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      />
    </div>
  );
};

export default React.memo(Game2DCalendar);