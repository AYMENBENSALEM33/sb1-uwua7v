export interface Series {
  id: number;
  name: string;
  description: string;
  colors: {
    default: string;
    [key: string]: string;
  };
  positions: {
    default: number;
    [key: string]: number;
  };
  isCustom?: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type NewSeries = Omit<Series, 'id' | 'order' | 'createdAt' | 'updatedAt'>;
export type UpdateSeries = Partial<Omit<Series, 'id'>>;