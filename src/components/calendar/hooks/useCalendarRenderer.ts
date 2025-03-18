import { useCallback, RefObject } from 'react';
import { useCalendarStore } from '../../../store/calendarStore';
import { getCanvasCoordinates } from '../utils/coordinates';
import { drawGrid, drawEvents } from '../utils/rendering';

export const useCalendarRenderer = (canvasRef: RefObject<HTMLCanvasElement>) => {
  const { events, config, selectedArc, setSelectedArc } = useCalendarStore();

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid and events
    drawGrid(ctx, config);
    drawEvents(ctx, events, selectedArc, config);
  }, [events, selectedArc, config]);

  // Gestionnaires d'événements
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e);
    // Logique de sélection...
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!e.buttons) return;
    const coords = getCanvasCoordinates(e);
    // Logique de drag...
  }, []);

  const handleMouseUp = useCallback(() => {
    // Logique de fin de drag...
  }, []);

  return {
    render,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};