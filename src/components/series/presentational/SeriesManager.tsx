import React from 'react';
import { SeriesList } from './SeriesList';
import { SeriesHeader } from './SeriesHeader';
import { AddEventModal, AddCategoryModal } from '../../common';
import { DiagnosticPanel } from '../../common';
import { Series } from '../../../models/Series';
import { Event } from '../../../models/Event';

interface SeriesManagerProps {
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

const SeriesManager: React.FC<SeriesManagerProps> = ({
  series,
  isEventModalOpen,
  isCategoryModalOpen,
  editingEvent,
  selectedCategory,
  onEditEvent,
  onAddEvent,
  onCloseEventModal,
  onCloseCategoryModal,
  onImport,
  onClearAll,
  onAddSeries
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <div className="p-4 border-b border-gray-200">
          <SeriesHeader
            onImport={onImport}
            onClearAll={onClearAll}
            onAddSeries={onAddSeries}
          />
        </div>
        
        <div className="p-4 space-y-4">
          <SeriesList
            series={series}
            onEditEvent={onEditEvent}
            onAddEvent={onAddEvent}
          />
        </div>
      </div>

      <DiagnosticPanel />

      <AddEventModal 
        isOpen={isEventModalOpen}
        onClose={onCloseEventModal}
        isDark={false}
        editingEvent={editingEvent}
        defaultSeriesId={selectedCategory ? parseInt(selectedCategory) : null}
      />

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={onCloseCategoryModal}
        isDark={false}
      />
    </div>
  );
};

export default SeriesManager;