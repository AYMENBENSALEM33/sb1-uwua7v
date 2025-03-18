export interface Point {
  x: number;
  y: number;
}

export interface Arc {
  id: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  color: string;
  name: string;
  year: number;
  startDayOfYear: number;
  endDayOfYear: number;
  duration: number;
  position: number;
  value: number;
  startDate: string;
  endDate: string;
}

export interface DayInfo {
  path: string;
  dayOfYear: number;
  isFirstOfMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  date: string;
  dayNumber: number;
  startAngle: number;
  endAngle: number;
}

export interface CalendarConfig {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  baseRadius: number;
  zoom: number;
  yearRange: number;
}

export interface GridItem extends DayInfo {
  labelX?: number;
  labelY?: number;
}