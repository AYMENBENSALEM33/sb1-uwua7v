import { useEventStore } from '../../store/eventStore';

export const getSeriesEvents = (categoryId: string) => {
  const { events } = useEventStore.getState();
  return events.filter(event => event.category === categoryId);
};

export const getSeriesVisibility = (categoryId: string): boolean => {
  const seriesEvents = getSeriesEvents(categoryId);
  return seriesEvents.some(event => event.visible);
};

export const getSeriesTotal = (categoryId: string): number => {
  const seriesEvents = getSeriesEvents(categoryId);
  return seriesEvents.reduce((total, event) => total + (event.value || 0), 0);
};