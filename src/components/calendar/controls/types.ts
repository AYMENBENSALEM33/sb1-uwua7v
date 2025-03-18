export interface CalendarControlsProps {
  scale: number;
  showTemperatures: boolean;
  onScaleChange: (scale: number) => void;
  onToggleTemperatures: () => void;
}