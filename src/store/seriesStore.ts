import { create } from 'zustand';
import { createSeriesSlice, SeriesStore } from './slices/seriesSlice';

export const useSeriesStore = create<SeriesStore>()((...args) => ({
  ...createSeriesSlice(...args)
}));