import { useEffect } from 'react';
import { useLogging } from '../../../hooks/useLogging';

export function useCanvasSetup(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  width: number,
  height: number
) {
  const logger = useLogging('CanvasSetup');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      logger.info('Canvas setup complete');
    }
  }, [width, height]);
}