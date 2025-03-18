import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useEventStore } from '../store/eventStore';
import { useSeriesStore } from '../store/seriesStore';
import { generateComponentKey } from '../utils/idGenerator';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  editingEvent?: any;
  defaultSeriesId?: number | null;
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  isDark,
  editingEvent,
  defaultSeriesId
}) => {
  const { addEvent, updateEvent } = useEventStore();
  const { series } = useSeriesStore();
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    color: '',
    value: 0,
    position: 1,
    seriesId: defaultSeriesId || (series[0]?.id ?? null)
  });

  useEffect(() => {
    if (editingEvent) {
      const startDate = new Date(editingEvent.startDate);
      const endDate = new Date(editingEvent.endDate);
      
      setFormData({
        name: editingEvent.name,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        color: editingEvent.color,
        value: editingEvent.value,
        position: editingEvent.position,
        seriesId: editingEvent.seriesId
      });
    } else if (defaultSeriesId) {
      const selectedSeries = series.find(s => s.id === defaultSeriesId);
      if (selectedSeries) {
        setFormData(prev => ({
          ...prev,
          seriesId: defaultSeriesId,
          color: selectedSeries.colors.default,
          position: selectedSeries.positions.default
        }));
      }
    }
  }, [editingEvent, defaultSeriesId, series]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, formData);
      } else {
        await addEvent({
          ...formData,
          visible: true,
          type: ''
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl w-full max-w-md`}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            {editingEvent ? "Modifier l'événement" : "Nouvel Événement"}
          </h2>
          <button onClick={onClose} className="hover:bg-gray-100 rounded-full p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Série</label>
            <select
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-indigo-500 outline-none`}
              value={formData.seriesId || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                seriesId: Number(e.target.value)
              }))}
              required
            >
              <option value="">Sélectionner une série</option>
              {series.map(s => (
                <option key={generateComponentKey(`series-${s.id}`)} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nom de l'événement</label>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date de début</label>
              <input
                type="date"
                required
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-indigo-500 outline-none`}
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date de fin</label>
              <input
                type="date"
                required
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-indigo-500 outline-none`}
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Couleur</label>
            <input
              type="color"
              className="w-full h-10 rounded-lg cursor-pointer"
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Position</label>
            <input
              type="number"
              required
              min="1"
              max="5"
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-indigo-500 outline-none`}
              value={formData.position}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                position: parseInt(e.target.value) || 1 
              }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Valeur</label>
            <input
              type="number"
              step="0.01"
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-indigo-500 outline-none`}
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                value: parseFloat(e.target.value) || 0 
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
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{editingEvent ? 'Modifier' : 'Créer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;