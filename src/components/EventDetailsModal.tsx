import React, { useState, useEffect } from 'react';
import { X, Save, Edit2 } from 'lucide-react';
import { useEventStore } from '../store/eventStore';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    color: string;
    value: number;
    category?: string;
    position: number;
  } | null;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ isOpen, onClose, event }) => {
  const { updateEvent } = useEventStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    color: '',
    value: 0,
    position: 1
  });

  useEffect(() => {
    if (event) {
      // Convert dates back to ISO format for input fields
      const startDate = new Date(event.startDate.split('/').reverse().join('-'));
      const endDate = new Date(event.endDate.split('/').reverse().join('-'));
      
      setFormData({
        name: event.name,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        color: event.color,
        value: event.value,
        position: event.position
      });
    }
  }, [event]);

  if (!isOpen || !event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (event.id) {
      updateEvent(event.id, formData);
      setIsEditing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Détails de l'événement</h2>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div 
                className="w-6 h-6 rounded-full" 
                style={{ backgroundColor: formData.color }}
              />
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Nom de l'événement"
                />
              ) : (
                <h3 className="text-lg font-medium">{event.name}</h3>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Dates</label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500">Début</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Fin</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="mt-1">
                    Du {event.startDate} au {event.endDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Position</label>
                {isEditing ? (
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                ) : (
                  <p className="mt-1">{event.position}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Couleur</label>
                {isEditing ? (
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                ) : (
                  <div 
                    className="w-full h-8 rounded-lg"
                    style={{ backgroundColor: event.color }}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Valeur</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                ) : (
                  event.value !== 0 && (
                    <p className={`mt-1 font-medium ${
                      event.value > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {event.value > 0 ? '+' : ''}{event.value.toFixed(2)}
                    </p>
                  )
                )}
              </div>

              {event.category && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Catégorie</label>
                  <p className="mt-1">{event.category}</p>
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EventDetailsModal;