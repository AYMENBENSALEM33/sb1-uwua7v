import { StateCreator } from 'zustand';
import { LoggerService } from '../../services/api/logger';

const logger = new LoggerService();

export interface CalendarState {
  startYear: number;
  yearCount: number;
  baseRadius: number;
  yearSpacing: number;
  scale: number;
}

export interface CalendarActions {
  addYear: () => void;
  removeYear: () => void;
  setStartYear: (year: number) => void;
  setScale: (scale: number) => void;
}

export type CalendarStore = CalendarState & CalendarActions;

const DEFAULT_CONFIG = {
  startYear: 2024,
  yearCount: 6, // Show 6 years by default (2024-2029)
  baseRadius: 200,
  yearSpacing: 50,
  scale: 1.3 // Default zoom at 130%
};

export const createCalendarSlice: StateCreator<CalendarStore> = (set) => ({
  ...DEFAULT_CONFIG,

  addYear: () => set(state => {
    logger.info('Adding year to calendar');
    return { yearCount: state.yearCount + 1 };
  }),

  removeYear: () => set(state => {
    if (state.yearCount <= 1) return state;
    logger.info('Removing year from calendar');
    return { yearCount: state.yearCount - 1 };
  }),

  setStartYear: (year: number) => set(() => {
    logger.info(`Setting start year to ${year}`);
    return { startYear: year };
  }),

  setScale: (scale: number) => set(() => {
    const clampedScale = Math.min(Math.max(scale, 0.5), 2);
    logger.info(`Setting scale to ${clampedScale}`);
    return { scale: clampedScale };
  })
});