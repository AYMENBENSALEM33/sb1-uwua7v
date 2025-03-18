import { Arc, GridItem, CalendarConfig } from '../types';
import { getSeasonColor } from '../../../utils/dateUtils';

export const drawGrid = (
  ctx: CanvasRenderingContext2D,
  grid: GridItem[],
  config: CalendarConfig
) => {
  const { centerX, centerY, baseRadius, zoom, yearRange } = config;

  // Draw year circles
  for (let yearOffset = 0; yearOffset < yearRange; yearOffset++) {
    const year = 2024 + yearOffset;
    const yearRadius = calculateYearRadius(year, baseRadius, zoom);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, yearRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw year label
    ctx.save();
    ctx.fillStyle = '#4B5563';
    ctx.font = `bold ${9 * zoom}px Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(`${year}`, centerX + yearRadius + 5, centerY);
    ctx.restore();
  }

  // Draw day sectors
  grid.forEach(item => {
    ctx.beginPath();
    const path = new Path2D(item.path);
    ctx.fillStyle = item.isToday
      ? 'rgba(239, 68, 68, 0.5)'
      : getSeasonColor(item.dayOfYear);
    ctx.fill(path);
    ctx.strokeStyle = item.isFirstOfMonth ? '#9CA3AF' : '#E5E7EB';
    ctx.lineWidth = item.isFirstOfMonth ? 1 : 0.5;
    ctx.stroke(path);

    // Draw day number if first of month or multiple of 5
    if (item.isFirstOfMonth || item.dayNumber % 5 === 0) {
      drawDayLabel(ctx, item, zoom);
    }
  });
};

export const drawEvents = (
  ctx: CanvasRenderingContext2D,
  events: Arc[],
  selectedArc: Arc | null,
  config: CalendarConfig
) => {
  events.forEach(arc => {
    drawArc(ctx, arc, config.centerX, config.centerY, config.zoom, arc.id === selectedArc?.id);
  });
};

const calculateYearRadius = (year: number, baseRadius: number, zoom: number): number => {
  const yearOffset = year - 2024;
  return (baseRadius + yearOffset * 30) * zoom;
};

const drawDayLabel = (ctx: CanvasRenderingContext2D, item: GridItem, zoom: number) => {
  ctx.save();
  ctx.translate(item.labelX, item.labelY);
  ctx.rotate((item.startAngle + item.endAngle) / 2 + Math.PI / 2);
  ctx.font = `${8 * zoom}px Arial`;
  ctx.fillStyle = item.dayNumber === 1 ? '#1F2937' : '#6B7280';
  ctx.textAlign = 'center';
  ctx.fillText(item.dayNumber.toString(), 0, 0);
  ctx.restore();
};