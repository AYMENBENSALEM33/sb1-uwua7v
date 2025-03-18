import React, { useState } from 'react';
import { useSeriesStore } from '../../../store/seriesStore';
import { SeriesSidebarHeader } from '../presentational/SeriesSidebarHeader';
import { SeriesSidebarList } from '../presentational/SeriesSidebarList';
import { AddEventModal, AddCategoryModal } from '../../common';

export const SeriesSidebar: React.FC = () => {
  const { series } = useSeriesStore();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedSeriesId, setSelectedSeriesId] = useState<number | null>(null);

  return (
    <aside className="w-80 bg-white border-l border-gray-200 h-screen fixed top-0 right-0 flex flex-col">
      <SeriesSidebarHeader 
        onAddSeries={() => setIsCategoryModalOpen(true)}
      />
      
      <div className="flex-1 overflow-y-auto p-4">
        <SeriesSidebarList
          series={series}
          onAddEvent={(seriesId) => {
            setSelectedSeriesId(seriesId);
            setIsEventModalOpen(true);
          }}
        />
      </div>

      <AddEventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedSeriesId(null);
        }}
        isDark={false}
        defaultSeriesId={selectedSeriesId}
      />

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        isDark={false}
      />
    </aside>
  );
};