import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useSeriesStore } from '../store/seriesStore';
import type { NewSeries } from '../models/Series';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, isDark }) => {
  const { addSeries } = useSeriesStore();
  const [formData, setFormData] = useState<NewSeries>({
    name: '',
    description: '',
    colors: { default: '#000000' },
    positions: { default: 1 },
    isCustom: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addSeries(formData);
      onClose();
      setFormData({
        name: '',
        description: '',
        colors: { default: '#000000' },
        positions: { default: 1 },
        isCustom: true
      });
    } catch (error) {
      console.error('Error adding series:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl w-full max-w-md`}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Nouvelle série d'événements</h2>
          <button onClick={onClose} className="hover:bg-gray-100 rounded-full p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom de la série</label>
            <input
              type="text"
              required
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-indigo-500 outline-none`}
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-indigo-500 outline-none`}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Couleur par défaut</label>
            <input
              type="color"
              className="w-full h-10 rounded-lg cursor-pointer"
              value={formData.colors.default}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                colors: { ...prev.colors, default: e.target.value }
              }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Position par défaut</label>
            <input
              type="number"
              required
              min="1"
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-indigo-500 outline-none`}
              value={formData.positions.default}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                positions: { ...prev.positions, default: parseInt(e.target.value) || 1 }
              }))}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;