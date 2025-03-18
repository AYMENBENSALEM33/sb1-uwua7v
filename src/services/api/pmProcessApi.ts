import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from './config';
import { LoggerService } from './logger';
import { ApiErrorHandler } from './errorHandler';
import { Event } from '../../models/Event';

export interface PmProcess {
  PmGuid: string;
  PmOrder: number;
  PmCreationDate: string;
  PmDescription: string;
}

export class PmProcessApi {
  private api: AxiosInstance;
  private logger: LoggerService;
  private errorHandler: ApiErrorHandler;

  constructor() {
    this.api = axios.create({
      ...API_CONFIG,
      baseURL: 'https://www.reyarn.fr/API33'
    });
    this.logger = new LoggerService();
    this.errorHandler = new ApiErrorHandler(this.logger);
  }

  async getLatestProcess(): Promise<PmProcess | null> {
    try {
      const response = await this.api.get<PmProcess>('/pmprocess');
      return response.data;
    } catch (error) {
      this.logger.error('Erreur lors de la récupération du dernier processus');
      return null;
    }
  }

  async createProcess(events: Event[]): Promise<PmProcess> {
    try {
      const processData = {
        PmOrder: 2,
        PmCreationDate: new Date().toISOString(),
        PmDescription: this.formatProcessDescription(events),
        PmTitle :'TEST'
        
      };

      const response = await this.api.post<PmProcess>('/pmprocess', processData);
      this.logger.success('Nouveau processus créé');
      return response.data;
    } catch (error) {
      throw this.errorHandler.handleError(error);
    }
  }

  async updateProcess(pmGuid: string, events: Event[]): Promise<void> {
    try {
      const updateData = {
        PmOrder: 1,
        PmDescription: this.formatProcessDescription(events)
      };

      await this.api.put(`/pmprocess/${pmGuid}`, updateData);
      this.logger.success('Processus mis à jour');
    } catch (error) {
      throw this.errorHandler.handleError(error);
    }
  }

  async getProcessesBetweenDates(startDate: Date, endDate: Date): Promise<PmProcess[]> {
    try {
      const response = await this.api.get<PmProcess[]>('/pmprocess/between-dates', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      return response.data;
    } catch (error) {
      throw this.errorHandler.handleError(error);
    }
  }

  private formatProcessDescription(events: Event[]): string {
    const now = new Date().toLocaleString('fr-FR');
    const eventsSummary = events.map(event => 
      `- ${event.name} (${event.startDate} au ${event.endDate})${
        event.value ? ` [${event.value > 0 ? '+' : ''}${event.value.toFixed(2)}]` : ''
      }`
    ).join('\n');

    return [
      `Synchronisation du ${now}`,
      `Nombre d'événements: ${events.length}`,
      '',
      'Événements:',
      eventsSummary
    ].join('\n');
  }
}

export const pmProcessApi = new PmProcessApi();