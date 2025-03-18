import React from 'react';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { getCanvasCoordinates } from '../utils/coordinates';

interface Props {
  children: (handlers: {
    onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    onMouseUp: () => void;
  }) => React.ReactNode;
}

const EventHandlerContainer: React.FC<Props> = ({ children }) => {
  const {
    handleEventSelection,
    handleDragStart,
    handleDragEnd
  } = useCalendarEvents();

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e);
    handleEventSelection(coords);
    handleDragStart(coords);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!e.buttons) return;
    const coords = getCanvasCoordinates(e);
    // Drag logic
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  return <>{children({
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp
  })}</>;
};

export default EventHandlerContainer;