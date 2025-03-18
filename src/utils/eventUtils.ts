import { Event } from '../models/Event';
import { Series } from '../models/Series';
import { generateUniqueId } from './idGenerator';

export const generatePmTitle = (event: Event): string => {
  const startDate = new Date(event.startDate);
  const timestamp = startDate.getTime();
  const sanitizedName = event.name.replace(/[^a-zA-Z0-9]/g, '_');
  return `${timestamp}_${sanitizedName}`;
};

export const formatEventForApi = (event: Event, series: Series) => {
  const eventData = {
    name: event.name,
    startDate: event.startDate,
    endDate: event.endDate,
    color: event.color,
    visible: event.visible,
    position: event.position,
    type: event.type || '',
    value: event.value,
    seriesId: event.seriesId,
    seriesName: series.name
  };

  return {
    PmOrder: event.position,
    PmCreationDate: new Date().toISOString(),
    PmDescription: JSON.stringify(eventData),
    PmTitle: generatePmTitle(event)
  };
};

export const parseEventFromApi = (process: any): Event | null => {
  try {
    const description = process.PmDescription;
    if (!description) return null;

    let eventData;
    try {
      eventData = JSON.parse(description);
    } catch {
      return null;
    }

    if (!eventData || typeof eventData !== 'object') return null;

    // Générer un ID unique basé sur le timestamp et le nom
    const id = generateUniqueId();

    return {
      id,
      name: eventData.name || process.PmTitle || 'Sans nom',
      startDate: eventData.startDate || process.PmCreationDate,
      endDate: eventData.endDate || process.PmCreationDate,
      color: eventData.color || '#000000',
      visible: eventData.visible !== false,
      position: eventData.position || process.PmOrder || 1,
      seriesId: eventData.seriesId || 1,
      type: eventData.type || '',
      value: Number(eventData.value) || 0,
      createdAt: process.PmCreationDate,
      updatedAt: process.PmCreationDate
    };
  } catch (error) {
    console.error('Erreur lors du parsing:', error);
    return null;
  }
};