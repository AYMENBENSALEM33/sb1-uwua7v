import { Arc } from '../types';
import { Event } from '../../../models/Event';
import { getDayOfYear } from '../../../utils/dateUtils';

export function calculateEventArc(event: Event): Arc {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const year = startDate.getFullYear();
  const startDayOfYear = getDayOfYear(startDate);
  const endDayOfYear = getDayOfYear(endDate);
  const duration = Math.max(1, endDayOfYear - startDayOfYear + 1);

  return {
    id: event.id,
    radius: 0, // Will be calculated by renderer
    startAngle: (startDayOfYear * 2 * Math.PI) / 365 - Math.PI / 2,
    endAngle: (endDayOfYear * 2 * Math.PI) / 365 - Math.PI / 2,
    color: event.color,
    name: event.name,
    year,
    startDayOfYear,
    endDayOfYear,
    duration,
    position: event.position,
    value: event.value,
    startDate: event.startDate,
    endDate: event.endDate
  };
}