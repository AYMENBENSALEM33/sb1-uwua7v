import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useSeriesStore } from '../../store/seriesStore';
import { useEventStore } from '../../store/eventStore';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, isDark }) => {
  const { addSeries } = useSeriesStore();
  const { loadEvents } = useEventStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    colors: { default: '#6366f1' },
    positions: { default: 1 },
    isCustom: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addSeries(formData);
      await loadEvents(); // Reload events to ensure consistency
      onClose();
      setFormData({
        name: '',
        description: '',
        colors: { default: '#6366f1' },
        positions: { default: 1 },
        isCustom: true
      });
    } catch (error) {
      console.error('Error adding series:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glassmorphism rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold neon-text">New Event Series</h2>
          <button onClick={onClose} className="hover:bg-white/5 rounded-full p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Series Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 bg-gray-800/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 bg-gray-800/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Default Color</label>
            <input
              type="color"
              className="w-full h-10 rounded-lg cursor-pointer bg-transparent"
              value={formData.colors.default}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                colors: { ...prev.colors, default: e.target.value }
              }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Default Position</label>
            <input
              type="number"
              required
              min="1"
              className="w-full px-3 py-2 bg-gray-800/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
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
              className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-violet-500/20 hover:bg-violet-500/30 rounded-lg transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;