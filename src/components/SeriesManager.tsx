import React, { useState, useRef } from 'react';
import { Plus, Upload, Trash2 } from 'lucide-react';
import { useEventStore } from '../store/eventStore';
import SeriesList from './SeriesList';
import AddEventModal from './AddEventModal';
import AddCategoryModal from './AddCategoryModal';
import DiagnosticPanel from './DiagnosticPanel';
import { handleFileUpload } from './seriesImport';

const SeriesManager: React.FC = () => {
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
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes les séries et tous les événements ? Cette action est irréversible.')) {
      clearAll();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Gestion des séries d'événements
            </h2>
            <div className="flex space-x-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={(e) => handleFileUpload(e, fileInputRef)}
                className="hidden"
              />
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Tout supprimer</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Importer</span>
              </button>
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvelle série</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <SeriesList
            onEditEvent={(event) => {
              setSelectedCategory(event.category);
              setEditingEvent(event);
              setIsEventModalOpen(true);
            }}
            onAddEvent={(categoryId) => {
              setSelectedCategory(categoryId);
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
        defaultCategory={selectedCategory}
      />

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        isDark={false}
      />
    </div>
  );
};

export default SeriesManager;