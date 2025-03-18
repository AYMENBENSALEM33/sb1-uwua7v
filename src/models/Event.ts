export interface Event {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  color: string;
  visible: boolean;
  position: number;
  seriesId: number;
  type?: string;
  value: number;
  createdAt: string;
  updatedAt: string;
}

export type NewEvent = Omit<Event, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEvent = Partial<Omit<Event, 'id'>>;