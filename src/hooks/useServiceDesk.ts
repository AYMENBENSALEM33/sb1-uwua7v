import { useState } from 'react';
import { serviceDeskApi } from '../services/api/serviceDeskApi';
import { Event } from '../store/eventStore';

export const useServiceDesk = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncEventsWithServiceDesk = async (events: Event[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await serviceDeskApi.syncEvents(events);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la synchronisation');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEventFromServiceDesk = async (event: Event) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await serviceDeskApi.deleteEvent(event);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadEvents = async (startDate: Date, endDate: Date) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await serviceDeskApi.downloadEvents(startDate, endDate);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du téléchargement');
    } finally {
      setIsLoading(false);
    }
  };

  const testServiceDeskConnection = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const isConnected = await serviceDeskApi.testConnection();
      if (!isConnected) {
        throw new Error('La connexion au Service Desk a échoué');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du test de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    syncEventsWithServiceDesk,
    deleteEventFromServiceDesk,
    downloadEvents,
    testServiceDeskConnection,
    currentRequestUrl: serviceDeskApi.currentRequestUrl
  };
};