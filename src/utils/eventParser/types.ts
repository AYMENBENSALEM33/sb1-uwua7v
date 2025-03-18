export interface ApiEvent {
  pmGuid: string;
  pmOrder: number;
  pmCreationDate: string;
  pmDescription: string;
}

export interface ParsedEventData {
  name: string;
  startDate: string;
  endDate: string;
  color?: string;
  position?: number;
  type?: string;
  value?: number;
  seriesId?: number;
}