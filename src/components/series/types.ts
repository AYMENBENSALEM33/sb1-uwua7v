import { Series } from '../../models/Series';
import { Event } from '../../models/Event';

export interface SeriesManagerProps {
  series: Series[];
  isEventModalOpen: boolean;
  isCategoryModalOpen: boolean;
  editingEvent: Event | null;
  selectedCategory: string | null;
  onEditEvent: (event: Event) => void;
  onAddEvent: (categoryId: string) => void;
  onCloseEventModal: () => void;
  onCloseCategoryModal: () => void;
  onImport: () => void;
  onClearAll: () => void;
  onAddSeries: () => void;
}

export interface SeriesItemProps {
  series: Series;
  events: Event[];
  isSelected: boolean;
  onSelect: () => void;
  onAddEvent: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  isDraggedOver: boolean;
  onEditEvent: (event: Event) => void;
}

export interface EventItemProps {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
}