import { Event } from '../../../models/Event';

export interface EventArcsProps {
  events: Event[];
  centerX: number;
  centerY: number;
  radius: number;
  scale: number;
}