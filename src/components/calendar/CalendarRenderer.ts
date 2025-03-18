import { Arc, DayInfo, CalendarConfig } from './types';
import { drawArc } from './CalendarArc';
import { drawGrid } from './CalendarGrid';
import { getDayOfYear } from '../../utils/dateUtils';
import { LoggerService } from '../../services/api/logger';

const logger = new LoggerService();

export class CalendarRenderer {
  private ctx: CanvasRenderingContext2D;
  private config: CalendarConfig;

  constructor(canvas: HTMLCanvasElement, config: CalendarConfig) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    this.ctx = ctx;
    this.config = config;
    
    logger.info('Calendar renderer initialized', {
      canvasSize: `${canvas.width}x${canvas.height}`,
      config: {
        zoom: config.zoom,
        yearRange: config.yearRange
      }
    });
  }

  render(events: any[], selectedArc: Arc | null): void {
    const { width, height, centerX, centerY, baseRadius, zoom, yearRange } = this.config;

    // Clear canvas
    this.ctx.clearRect(0, 0, width, height);
    
    // Calculate radius and day sectors
    const radius = baseRadius * zoom;
    const daySectors = this.calculateDaySectors(radius);
    
    logger.debug('Rendering calendar', {
      eventsCount: events.length,
      radius,
      sectorsCount: daySectors.length
    });
    
    // Draw base grid
    drawGrid(this.ctx, centerX, centerY, radius, zoom, yearRange, daySectors);
    
    // Draw event arcs
    let renderedArcs = 0;
    events.forEach(event => {
      const arc = this.calculateEventArc(event);
      if (arc) {
        drawArc(this.ctx, arc, centerX, centerY, zoom, arc.id === selectedArc?.id);
        renderedArcs++;
      }
    });
    
    logger.info(`Calendar rendered: ${renderedArcs}/${events.length} events drawn`);
  }

  private calculateDaySectors(radius: number): DayInfo[] {
    const today = new Date();
    const currentDayOfYear = getDayOfYear(today);
    const sectors: DayInfo[] = [];

    for (let i = 0; i < 365; i++) {
      const angle = (i * 2 * Math.PI) / 365 - Math.PI / 2;
      const nextAngle = ((i + 1) * 2 * Math.PI) / 365 - Math.PI / 2;
      
      const date = new Date(2024, 0, i + 1);
      const isFirstOfMonth = date.getDate() === 1;
      
      sectors.push({
        path: this.calculateSectorPath(angle, nextAngle, radius),
        dayOfYear: i + 1,
        isFirstOfMonth,
        isToday: i + 1 === currentDayOfYear,
        isSelected: false,
        date: date.toLocaleDateString('fr-FR'),
        dayNumber: date.getDate(),
        labelX: this.config.centerX + (radius - 15) * Math.cos((angle + nextAngle) / 2),
        labelY: this.config.centerY + (radius - 15) * Math.sin((angle + nextAngle) / 2),
        startAngle: angle,
        endAngle: nextAngle
      });
    }

    return sectors;
  }

  private calculateSectorPath(startAngle: number, endAngle: number, radius: number): string {
    const { centerX, centerY } = this.config;
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
  }

  private calculateEventArc(event: any): Arc | null {
    try {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      const year = startDate.getFullYear();
      const startDayOfYear = getDayOfYear(startDate);
      const endDayOfYear = getDayOfYear(endDate);
      
      return {
        id: event.id,
        radius: this.calculateRadius(year, event.position - 1),
        startAngle: (startDayOfYear * 2 * Math.PI) / 365 - Math.PI / 2,
        endAngle: (endDayOfYear * 2 * Math.PI) / 365 - Math.PI / 2,
        color: event.color,
        name: event.name,
        year,
        startDayOfYear,
        endDayOfYear,
        duration: Math.max(1, endDayOfYear - startDayOfYear + 1),
        position: event.position,
        value: event.value,
        startDate: startDate.toLocaleDateString('fr-FR'),
        endDate: endDate.toLocaleDateString('fr-FR')
      };
    } catch (error) {
      logger.error(`Failed to calculate arc for event ${event.id}: ${error}`);
      return null;
    }
  }

  private calculateRadius(year: number, track: number = 0): number {
    const yearOffset = year - 2024;
    const trackStep = 30 / 6;
    return (this.config.baseRadius + yearOffset * 30 + track * trackStep) * this.config.zoom;
  }
}