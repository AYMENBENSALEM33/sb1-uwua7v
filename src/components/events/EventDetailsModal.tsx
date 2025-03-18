import React from 'react';
import { X, Trash2, Edit } from 'lucide-react';
import { Event } from '../../models/Event';
import { useEventStore } from '../../store/eventStore';
import { formatDate } from '../../utils/dateUtils';

interface EventDetailsModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  isOpen,
  onClose,
  onEdit
}) => {
  const { deleteEvent } = useEventStore();

  if (!isOpen || !event) return null;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(event.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glassmorphism rounded-lg w-full max-w-md animate-slideIn">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold neon-text">Event Details</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-violet-400"
              title="Edit event"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-red-400"
              title="Delete event"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: event.color }}
              />
              <h3 className="text-lg font-medium">{event.name}</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Dates</label>
                <p className="text-white">
                  {formatDate(event.startDate)}
                  {event.startDate !== event.endDate && 
                    ` - ${formatDate(event.endDate)}`
                  }
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Position</label>
                <p className="text-white">{event.position}</p>
              </div>

              {event.value !== 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Value</label>
                  <p className={`font-medium ${
                    event.value > 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {event.value > 0 ? '+' : ''}{event.value.toFixed(2)}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Color</label>
                <div 
                  className="w-full h-8 rounded-lg"
                  style={{ backgroundColor: event.color }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};