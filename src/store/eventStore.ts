import { create } from 'zustand';
import { createEventSlice, EventStore } from './slices/eventSlice';

export const useEventStore = create<EventStore>()((...args) => ({
  ...createEventSlice(...args)
}));