import React, { useState } from 'react';
import { X, Calendar, Clock, Save, AlertCircle } from 'lucide-react';
import { useEventStore } from '../../store/eventStore';
import { useSeriesStore } from '../../store/seriesStore';
import { LoggerService } from '../../services/api/logger';
import { toISODateString } from '../../utils/dateUtils';

const logger = new LoggerService();

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSeriesId?: number;
  editingEvent?: any;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({ 
  isOpen, 
  onClose,
  defaultSeriesId,
  editingEvent 
}) => {
  const { addEvent, updateEvent } = useEventStore();
  const { series } = useSeriesStore();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultSeries = series.find(s => s.id === defaultSeriesId) || series[0];
  const [formData, setFormData] = useState({
    name: editingEvent?.name || '',
    startDate: editingEvent?.startDate ? toISODateString(new Date(editingEvent.startDate)) : '',
    endDate: editingEvent?.endDate ? toISODateString(new Date(editingEvent.endDate)) : '',
    color: editingEvent?.color || defaultSeries?.colors.default || '#6366f1',
    value: editingEvent?.value || 0,
    position: editingEvent?.position || defaultSeries?.positions.default || 1,
    seriesId: editingEvent?.seriesId || defaultSeries?.id || 0,
    visible: editingEvent?.visible ?? true,
    type: editingEvent?.type || ''
  });

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Event name is required';
    }
    if (!formData.startDate || !formData.endDate) {
      return 'Start and end dates are required';
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      return 'Start date must be before or equal to end date';
    }
    if (formData.position < 1 || formData.position > 5) {
      return 'Position must be between 1 and 5';
    }
    if (!formData.seriesId) {
      return 'Series is required';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingEvent) {
        logger.info('Updating event', { 
          id: editingEvent.id,
          name: formData.name
        });
        await updateEvent(editingEvent.id, formData);
        logger.success('Event updated successfully');
      } else {
        logger.info('Creating new event', { 
          name: formData.name,
          seriesId: formData.seriesId
        });
        await addEvent(formData);
        logger.success('Event created successfully');
      }
      
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save event';
      logger.error(`Error saving event: ${message}`);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glassmorphism rounded-lg w-full max-w-md animate-slideIn">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold neon-text">
            {editingEvent ? 'Edit Event' : 'New Event'}
          </h2>
          <button onClick={onClose} className="hover:bg-white/5 rounded-full p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center space-x-2 text-red-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Series</label>
            <select
              className="w-full px-3 py-2 bg-gray-800/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
              value={formData.seriesId}
              onChange={(e) => {
                const selectedSeries = series.find(s => s.id === Number(e.target.value));
                setFormData(prev => ({
                  ...prev,
                  seriesId: Number(e.target.value),
                  color: selectedSeries?.colors.default || prev.color,
                  position: selectedSeries?.positions.default || prev.position
                }));
              }}
            >
              <option value="">Select a series</option>
              {series.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Event Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 bg-gray-800/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  required
                  className="w-full pl-10 pr-3 py-2 bg-gray-800/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  required
                  className="w-full pl-10 pr-3 py-2 bg-gray-800/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <input
              type="color"
              className="w-full h-10 rounded-lg cursor-pointer bg-transparent"
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Position (1-5)</label>
            <input
              type="number"
              required
              min="1"
              max="5"
              className="w-full px-3 py-2 bg-gray-800/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
              value={formData.position}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                position: parseInt(e.target.value) || 1 
              }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Value</label>
            <input
              type="number"
              step="0.01"
              className="w-full px-3 py-2 bg-gray-800/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
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
              className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-violet-500/20 hover:bg-violet-500/30 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Save className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
              <span>{isSubmitting ? 'Saving...' : (editingEvent ? 'Update' : 'Create')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};