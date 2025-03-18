import React, { useState, useRef, useCallback } from 'react';
import { useEventStore } from '../../../store/eventStore';
import { useSeriesStore } from '../../../store/seriesStore';
import { SeriesManager } from '../presentational';
import { handleFileUpload } from '../utils/fileUpload';
import { Event } from '../../../models/Event';

const SeriesManagerContainer: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { clearAll } = useEventStore();
  const { series } = useSeriesStore();

  const handleCloseEventModal = useCallback(() => {
    setIsEventModalOpen(false);
    setEditingEvent(null);
    setSelectedCategory(null);
  }, []);

  const handleClearAll = useCallback(() => {
    if (window.confirm('Are you sure you want to delete all series and events? This action cannot be undone.')) {
      clearAll();
    }
  }, [clearAll]);

  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleEditEvent = useCallback((event: Event) => {
    setSelectedCategory(event.seriesId.toString());
    setEditingEvent(event);
    setIsEventModalOpen(true);
  }, []);

  const handleAddEvent = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setEditingEvent(null);
    setIsEventModalOpen(true);
  }, []);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={(e) => handleFileUpload(e, fileInputRef)}
        className="hidden"
      />
      
      <SeriesManager
        series={series}
        isEventModalOpen={isEventModalOpen}
        isCategoryModalOpen={isCategoryModalOpen}
        editingEvent={editingEvent}
        selectedCategory={selectedCategory}
        onEditEvent={handleEditEvent}
        onAddEvent={handleAddEvent}
        onCloseEventModal={handleCloseEventModal}
        onCloseCategoryModal={() => setIsCategoryModalOpen(false)}
        onImport={handleImport}
        onClearAll={handleClearAll}
        onAddSeries={() => setIsCategoryModalOpen(true)}
      />
    </>
  );
};

export default SeriesManagerContainer;