import { StateCreator } from 'zustand';
import { Series, NewSeries } from '../../models/Series';
import { seriesRepository } from '../../db';
import { LoggerService } from '../../services/api/logger';

const logger = new LoggerService();

export interface SeriesState {
  series: Series[];
  isLoading: boolean;
  error: string | null;
}

export interface SeriesActions {
  loadSeries: () => Promise<void>;
  addSeries: (series: NewSeries) => Promise<number>;
  updateSeries: (id: number, series: Partial<Series>) => Promise<void>;
  deleteSeries: (id: number) => Promise<void>;
  reorderSeries: (sourceId: number, targetId: number) => Promise<void>;
}

export type SeriesStore = SeriesState & SeriesActions;

export const createSeriesSlice: StateCreator<SeriesStore> = (set, get) => ({
  series: [],
  isLoading: false,
  error: null,

  loadSeries: async () => {
    set({ isLoading: true, error: null });
    try {
      logger.info('Loading series...');
      const series = await seriesRepository.findAll();
      logger.success(`Loaded ${series.length} series`);
      set({ series, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Error loading series: ${message}`);
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  addSeries: async (seriesData) => {
    set({ isLoading: true, error: null });
    try {
      // Get current max order
      const currentSeries = get().series;
      const maxOrder = Math.max(...currentSeries.map(s => s.order), -1);
      
      const now = new Date().toISOString();
      const newSeries: Series = {
        ...seriesData,
        id: Date.now(),
        order: maxOrder + 1,
        createdAt: now,
        updatedAt: now
      };

      // Save to repository
      await seriesRepository.create(newSeries);
      logger.success(`Series "${newSeries.name}" created with ID ${newSeries.id}`);
      
      // Update state immediately
      set(state => ({
        series: [...state.series, newSeries],
        isLoading: false
      }));

      return newSeries.id;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Error creating series: ${message}`);
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateSeries: async (id, seriesData) => {
    set({ isLoading: true, error: null });
    try {
      await seriesRepository.update(id, {
        ...seriesData,
        updatedAt: new Date().toISOString()
      });
      
      set(state => ({
        series: state.series.map(s => 
          s.id === id ? { ...s, ...seriesData } : s
        ),
        isLoading: false
      }));
      
      logger.success(`Series ${id} updated`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Error updating series: ${message}`);
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deleteSeries: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await seriesRepository.delete(id);
      
      set(state => ({
        series: state.series.filter(s => s.id !== id),
        isLoading: false
      }));
      
      logger.success(`Series ${id} deleted`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Error deleting series: ${message}`);
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  reorderSeries: async (sourceId, targetId) => {
    set({ isLoading: true, error: null });
    try {
      await seriesRepository.reorder(sourceId, targetId);
      const series = await seriesRepository.findAll();
      logger.success('Series reordered');
      set({ series, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Error reordering series: ${message}`);
      set({ error: message, isLoading: false });
      throw error;
    }
  }
});