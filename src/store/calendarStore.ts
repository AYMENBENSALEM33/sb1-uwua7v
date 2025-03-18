import { create } from 'zustand';
import { Arc, CalendarConfig } from '../components/calendar/types';

interface CalendarState {
  events: any[];
  config: CalendarConfig;
  selectedArc: Arc | null;
  isDragging: boolean;
}

interface CalendarActions {
  updateZoom: (delta: number) => void;
  setSelectedArc: (arc: Arc | null) => void;
  updateEventPosition: (eventId: number, position: number) => void;
  setIsDragging: (isDragging: boolean) => void;
}

const DEFAULT_CONFIG: CalendarConfig = {
  width: 1000,
  height: 1000,
  centerX: 500,
  centerY: 500,
  baseRadius: 300,
  zoom: 1,
  yearRange: 10
};

export const useCalendarStore = create<CalendarState & CalendarActions>((set) => ({
  events: [],
  config: DEFAULT_CONFIG,
  selectedArc: null,
  isDragging: false,

  updateZoom: (delta) => set((state) => ({
    config: {
      ...state.config,
      zoom: Math.max(0.5, Math.min(2, state.config.zoom + delta))
    }
  })),

  setSelectedArc: (arc) => set({ selectedArc: arc }),

  updateEventPosition: (eventId, position) => set((state) => ({
    events: state.events.map(event =>
      event.id === eventId ? { ...event, position } : event
    )
  })),

  setIsDragging: (isDragging) => set({ isDragging })
}));