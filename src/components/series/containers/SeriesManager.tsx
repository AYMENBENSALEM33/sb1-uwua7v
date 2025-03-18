import React, { useState, useRef } from 'react';
import { useEventStore } from '../../../store/eventStore';
import { SeriesHeader } from '../presentational/SeriesHeader';
import { SeriesList } from '../presentational/SeriesList';
import { AddEventModal, AddCategoryModal } from '../../common';
import { DiagnosticPanel } from '../../diagnostic';
import { handleFileUpload } from '../utils/fileUpload';

export const SeriesManager: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { clearAll } = useEventStore();

  const handleCloseEventModal = () => {
    setIsEventModalOpen(false);
    setEditingEvent(null);
    setSelectedCategory(null);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all series and events? This action cannot be undone.')) {
      clearAll();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <div className="p-4 border-b border-gray-200">
          <SeriesHeader
            onImport={() => fileInputRef.current?.click()}
            onClearAll={handleClearAll}
            onAddSeries={() => setIsCategoryModalOpen(true)}
          />
        </div>
        
        <div className="p-4 space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={(e) => handleFileUpload(e, fileInputRef)}
            className="hidden"
          />
          
          <SeriesList
            onEditEvent={(event) => {
              setSelectedCategory(event.seriesId.toString());
              setEditingEvent(event);
              setIsEventModalOpen(true);
            }}
            onAddEvent={(seriesId) => {
              setSelectedCategory(seriesId.toString());
              setEditingEvent(null);
              setIsEventModalOpen(true);
            }}
          />
        </div>
      </div>

      <DiagnosticPanel />

      <AddEventModal 
        isOpen={isEventModalOpen}
        onClose={handleCloseEventModal}
        isDark={false}
        editingEvent={editingEvent}
        defaultSeriesId={selectedCategory ? parseInt(selectedCategory) : null}
      />

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        isDark={false}
      />
    </div>
  );
};