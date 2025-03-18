import { Event } from '../models/Event';
import { serviceDeskApi } from './api/serviceDeskApi';
import { eventRepository } from '../db';
import { LoggerService } from './api/logger';

const logger = new LoggerService();

class SyncService {
  async syncEventsForDateRange(startDate: Date, endDate: Date): Promise<void> {
    try {
      logger.info(`🔄 Début de la synchronisation pour la période ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);

      // Récupérer les événements de l'API
      const apiEvents = await serviceDeskApi.getEvents(startDate, endDate);
      logger.success(`✅ ${apiEvents.length} événements récupérés depuis l'API`);

      // Récupérer les événements locaux pour la même période
      const localEvents = await eventRepository.findBetweenDates(startDate, endDate);
      logger.info(`📊 ${localEvents.length} événements trouvés en local`);

      // Créer un index des événements locaux par ID
      const localEventsById = new Map(localEvents.map(e => [e.id, e]));

      // Traiter chaque événement de l'API
      for (const apiEvent of apiEvents) {
        const localEvent = localEventsById.get(apiEvent.id);

        if (!localEvent) {
          // Nouvel événement
          await eventRepository.create(apiEvent);
          logger.success(`✅ Nouvel événement créé: ${apiEvent.name}`);
        } else if (new Date(apiEvent.updatedAt) > new Date(localEvent.updatedAt)) {
          // Mise à jour nécessaire
          await eventRepository.update(apiEvent.id, apiEvent);
          logger.success(`✅ Événement mis à jour: ${apiEvent.name}`);
        }
      }

      // Supprimer les événements locaux qui n'existent plus dans l'API
      const apiEventIds = new Set(apiEvents.map(e => e.id));
      for (const localEvent of localEvents) {
        if (!apiEventIds.has(localEvent.id)) {
          await eventRepository.delete(localEvent.id);
          logger.info(`🗑️ Événement supprimé: ${localEvent.name}`);
        }
      }

      logger.success('✅ Synchronisation terminée avec succès');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      logger.error(`❌ Erreur lors de la synchronisation: ${message}`);
      throw error;
    }
  }

  async getLastSyncStatus(): Promise<{ lastSync: Date | null; status: 'success' | 'error' | null }> {
    try {
      // Implémenter la logique pour récupérer le statut de la dernière synchro
      return {
        lastSync: null,
        status: null
      };
    } catch (error) {
      logger.error('Erreur lors de la récupération du statut de synchronisation');
      return {
        lastSync: null,
        status: 'error'
      };
    }
  }
}

export const syncService = new SyncService();