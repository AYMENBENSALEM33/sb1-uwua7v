import { useMemo } from 'react';
import { useEventStore, Event, EventCategory } from '../store/eventStore';

interface GroupedEvents {
  [categoryId: string]: {
    category: EventCategory;
    events: Event[];
  };
}

export const useEventsByCategory = () => {
  const { events, categories } = useEventStore();

  return useMemo(() => {
    return events.reduce<GroupedEvents>((acc, event) => {
      const categoryId = event.category;
      const category = categories[categoryId];
      
      if (!category) {
        console.warn(`Événement ${event.id} avec catégorie invalide ${categoryId}`);
        return acc;
      }
      
      if (!acc[categoryId]) {
        acc[categoryId] = {
          category,
          events: []
        };
      }
      
      acc[categoryId].events.push(event);
      return acc;
    }, {});
  }, [events, categories]);
};