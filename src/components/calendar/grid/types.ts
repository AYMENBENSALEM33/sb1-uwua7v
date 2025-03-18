export interface CalendarGridProps {
  centerX: number;
  centerY: number;
  radius: number;
  scale: number;
}

export interface GridSector {
  startAngle: number;
  endAngle: number;
  dayOfYear: number;
  isFirstOfMonth: boolean;
  dayNumber: number;
  date: Date;
}

export interface GridSectorProps {
  sector: GridSector;
  centerX: number;
  centerY: number;
  radius: number;
}

export interface MonthLabelProps extends GridSectorProps {
  scale: number;
}