import { Event } from '../store/eventStore';

const API_ENDPOINT = '/api/events';

export const saveEvents = async (events: Event[], seriesId: string): Promise<void> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        events,
        seriesId
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save events');
    }
  } catch (error) {
    console.error('Error saving events:', error);
    throw error;
  }
};

export const getSeriesEvents = async (seriesId: string): Promise<{ events: Event[] }> => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${seriesId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};