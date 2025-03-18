import { Point } from '../types';

export const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
  const canvas = e.currentTarget;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
};

export const calculateRadius = (
  year: number,
  track: number,
  baseRadius: number,
  zoom: number
): number => {
  const yearOffset = year - 2024;
  const trackStep = 30 / 6;
  return (baseRadius + yearOffset * 30 + track * trackStep) * zoom;
};