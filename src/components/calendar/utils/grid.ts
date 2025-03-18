import { CalendarConfig, GridItem } from '../types';
import { getSeasonColor } from '../../../utils/dateUtils';

export const calculateGrid = (config: CalendarConfig): GridItem[] => {
  const { centerX, centerY, baseRadius, zoom } = config;
  const radius = baseRadius * zoom;
  const grid: GridItem[] = [];

  for (let i = 0; i < 365; i++) {
    const angle = (i * 2 * Math.PI) / 365 - Math.PI / 2;
    const nextAngle = ((i + 1) * 2 * Math.PI) / 365 - Math.PI / 2;
    
    const date = new Date(2024, 0, i + 1);
    const isFirstOfMonth = date.getDate() === 1;
    const today = new Date();
    const isToday = i + 1 === getDayOfYear(today);

    grid.push({
      path: calculateSectorPath(centerX, centerY, radius, angle, nextAngle),
      dayOfYear: i + 1,
      isFirstOfMonth,
      isToday,
      isSelected: false,
      date: date.toLocaleDateString('fr-FR'),
      dayNumber: date.getDate(),
      startAngle: angle,
      endAngle: nextAngle
    });
  }

  return grid;
};

const calculateSectorPath = (
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string => {
  const x1 = centerX + radius * Math.cos(startAngle);
  const y1 = centerY + radius * Math.sin(startAngle);
  const x2 = centerX + radius * Math.cos(endAngle);
  const y2 = centerY + radius * Math.sin(endAngle);
  
  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
};

const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};