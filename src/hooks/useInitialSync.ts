import { useState } from 'react';
import { useEventStore } from '../store/eventStore';
import { useSeriesStore } from '../store/seriesStore';
import { serviceDeskApi } from '../services/api/serviceDeskApi';
import { syncService } from '../services/syncService';
import { LoggerService } from '../services/api/logger';

const logger = new LoggerService();

export const useInitialSync = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(true);
  const { addEvent } = useEventStore();
  const { addSeries } = useSeriesStore();

  const loadEvents = async (startDate: Date, endDate: Date) => {
    try {
      logger.info(`🔄 Chargement des événements du ${startDate.toLocaleDateString()} au ${endDate.toLocaleDateString()}`);
      setIsLoading(true);
      setError(null);

      // Récupérer les événements depuis l'API
      const events = await serviceDeskApi.getEvents(startDate, endDate);
      logger.success(`✅ ${events.length} événements récupérés`);

      // Traiter chaque événement
      let importedCount = 0;
      let errorCount = 0;

      for (const event of events) {
        try {
          // Créer la série si elle n'existe pas
          let seriesId = event.seriesId;
          if (!seriesId) {
            seriesId = await addSeries({
              name: event.seriesName || 'Série par défaut',
              description: '',
              colors: { default: event.color },
              positions: { default: event.position },
              isCustom: true
            });
          }

          // Ajouter l'événement
          await addEvent({
            ...event,
            seriesId,
            visible: true
          });

          importedCount++;
          logger.success(`✅ Événement "${event.name}" importé`);
        } catch (error) {
          errorCount++;
          logger.error(`❌ Erreur lors de l'import de l'événement "${event.name}": ${error.message}`);
        }
      }

      // Synchroniser avec la base locale
      await syncService.fullSync();
      
      logger.success(`
        ✅ Import terminé:
        - ${importedCount} événements importés
        - ${errorCount} erreurs
      `);

      setIsDatePickerOpen(false);
      setIsLoading(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      setError(message);
      logger.error(`❌ Erreur lors du chargement: ${message}`);
      setIsLoading(false);
    }
  };

  return { 
    isLoading, 
    error, 
    isDatePickerOpen,
    loadEvents,
    setIsDatePickerOpen
  };
};