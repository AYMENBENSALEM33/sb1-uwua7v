import { StateCreator } from 'zustand';
import { Event } from '../../models/Event';
import { eventRepository } from '../../db';
import { LoggerService } from '../../services/api/logger';
import { EventValidator } from '../../utils/validation/eventValidator';

const logger = new LoggerService();

export interface EventState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
}

export interface EventActions {
  loadEvents: () => Promise<void>;
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEvent: (id: number, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
  toggleVisibility: (id: number) => Promise<void>;
  clearAll: () => Promise<void>;
}

export type EventStore = EventState & EventActions;

export const createEventSlice: StateCreator<EventStore> = (set, get) => ({
  events: [],
  isLoading: false,
  error: null,

  loadEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      logger.info('Loading events from repository');
      const events = await eventRepository.findAll();
      set({ events, isLoading: false });
      logger.success(`Loaded ${events.length} events successfully`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to load events: ${message}`);
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  addEvent: async (eventData) => {
    set({ isLoading: true, error: null });
    try {
      // Validate event data
      const validation = EventValidator.validateEvent(eventData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const now = new Date().toISOString();
      const newEvent: Event = {
        ...eventData,
        id: Date.now(),
        createdAt: now,
        updatedAt: now
      };

      await eventRepository.create(newEvent);
      
      set(state => ({
        events: [...state.events, newEvent],
        isLoading: false
      }));

      logger.success(`Event "${newEvent.name}" created successfully`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add event';
      logger.error(`Error creating event: ${message}`);
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateEvent: async (id, eventData) => {
    set({ isLoading: true, error: null });
    try {
      const currentEvent = get().events.find(e => e.id === id);
      if (!currentEvent) {
        throw new Error(`Event with id ${id} not found`);
      }

      const updatedEvent = {
        ...currentEvent,
        ...eventData,
        updatedAt: new Date().toISOString()
      };

      // Validate updated event
      const validation = EventValidator.validateEvent(updatedEvent);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      await eventRepository.update(id, updatedEvent);
      
      set(state => ({
        events: state.events.map(e => e.id === id ? updatedEvent : e),
        isLoading: false
      }));

      logger.success(`Event ${id} updated successfully`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update event';
      logger.error(`Failed to update event ${id}: ${message}`);
      set({ error: message, isLoading: false });
      throw error;
    }
  }
});