import { useState, useCallback } from 'react';
import { CalendarConfig } from '../types';
import { LoggerService } from '../../../services/api/logger';

const logger = new LoggerService();

const DEFAULT_CONFIG: CalendarConfig = {
  width: 1000,
  height: 1000,
  centerX: 500,
  centerY: 500,
  baseRadius: 300,
  zoom: 1,
  yearRange: 10
};

export function useCalendarState() {
  const [config, setConfig] = useState<CalendarConfig>(DEFAULT_CONFIG);

  const updateZoom = useCallback((delta: number) => {
    setConfig(prev => {
      const newZoom = Math.max(0.5, Math.min(2, prev.zoom + delta));
      logger.info(`Zoom updated: ${prev.zoom} -> ${newZoom}`);
      return { ...prev, zoom: newZoom };
    });
  }, []);

  return {
    config,
    updateZoom
  };
}