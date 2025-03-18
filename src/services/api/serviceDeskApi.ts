import axios from 'axios';
import { Event } from '../../models/Event';
import { LoggerService } from './logger';
import { eventParser } from '../../utils/eventParser';
import { ENDPOINTS } from './endpoints';
import { API_CONFIG } from './config';
import { setupLoggingInterceptor } from './interceptors/loggingInterceptor';

const logger = new LoggerService();

export class ServiceDeskApi {
  private api = axios.create(API_CONFIG);

  constructor() {
    setupLoggingInterceptor(this.api);
  }

  async getEvents(startDate: Date, endDate: Date): Promise<Event[]> {
    try {
      logger.info('Fetching events from API', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      const response = await this.api.get(ENDPOINTS.events.list, {
        params: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        }
      });

      if (!response.data) {
        throw new Error('No data received from API');
      }

      // Parse API response into Event objects
      const events = await eventParser.parseApiEvents(response.data);
      logger.success(`Successfully fetched ${events.length} events`);
      return events;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error(`API request failed: ${message}`, {
          status: error.response?.status,
          url: error.config?.url
        });
        throw new Error(`Failed to fetch events: ${message}`);
      }
      throw error;
    }
  }

  async deleteSeriesEvents(seriesId: number): Promise<void> {
    try {
      const endpoint = ENDPOINTS.events.delete(seriesId);
      await this.api.delete(endpoint);
      logger.success(`Successfully deleted events for series ${seriesId}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error(`Failed to delete series events: ${message}`);
        throw new Error(`Failed to delete series events: ${message}`);
      }
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.api.get(ENDPOINTS.events.test);
      logger.success('API connection test successful');
      return true;
    } catch (error) {
      logger.error('API connection test failed', error);
      return false;
    }
  }
}

export const serviceDeskApi = new ServiceDeskApi();