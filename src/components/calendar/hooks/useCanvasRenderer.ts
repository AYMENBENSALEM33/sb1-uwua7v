import { useRef, useEffect, useMemo } from 'react';
import { CalendarRenderer } from '../CalendarRenderer';
import { useLogging } from '../../../hooks/useLogging';
import { Arc } from '../types';
import { useRenderLoop } from './useRenderLoop';
import { useCanvasSetup } from './useCanvasSetup';

interface RendererConfig {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  baseRadius: number;
  zoom: number;
  yearRange: number;
}

export function useCanvasRenderer(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  config: RendererConfig,
  events: any[],
  selectedArc: Arc | null
) {
  const rendererRef = useRef<CalendarRenderer | null>(null);
  const logger = useLogging('CanvasRenderer');

  // Memoize config to prevent unnecessary re-renders
  const memoizedConfig = useMemo(() => ({
    width: config.width,
    height: config.height,
    centerX: config.centerX,
    centerY: config.centerY,
    baseRadius: config.baseRadius,
    zoom: config.zoom,
    yearRange: config.yearRange
  }), [
    config.width,
    config.height,
    config.centerX,
    config.centerY,
    config.baseRadius,
    config.zoom,
    config.yearRange
  ]);

  // Memoize events array to prevent unnecessary re-renders
  const memoizedEvents = useMemo(() => events, [events]);

  // Initialize canvas setup
  useCanvasSetup(canvasRef, memoizedConfig.width, memoizedConfig.height);

  // Initialize renderer once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      rendererRef.current = new CalendarRenderer(canvas, memoizedConfig);
      logger.info('Calendar renderer initialized');

      return () => {
        rendererRef.current = null;
      };
    } catch (error) {
      logger.error('Failed to initialize renderer:', error);
    }
  }, [memoizedConfig, logger]);

  // Handle render loop
  useRenderLoop({
    renderer: rendererRef.current,
    events: memoizedEvents,
    selectedArc,
    config: memoizedConfig
  });
}