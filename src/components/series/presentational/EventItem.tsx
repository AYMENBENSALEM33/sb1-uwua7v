import React from 'react';
import { Eye, EyeOff, Edit, Trash2 } from 'lucide-react';
import { EventItemProps } from '../types';

export const EventItem: React.FC<EventItemProps> = ({
  event,
  onEdit,
  onDelete,
  onToggleVisibility
}) => {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div>
        <div className="font-medium">{event.name}</div>
        <div className="text-sm text-gray-500">
          {new Date(event.startDate).toLocaleDateString('fr-FR')}
          {event.startDate !== event.endDate && 
            ` - ${new Date(event.endDate).toLocaleDateString('fr-FR')}`
          }
          {event.value !== 0 && (
            <span className={`ml-2 font-medium ${
              event.value > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ({event.value > 0 ? '+' : ''}{event.value.toFixed(2)})
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleVisibility}
          className={`p-1 rounded-lg transition-colors ${
            event.visible
              ? 'text-green-600 hover:bg-green-100'
              : 'text-gray-400 hover:bg-gray-100'
          }`}
        >
          {event.visible ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={onEdit}
          className="p-1 text-blue-600 hover:bg-blue-100 rounded-lg"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 text-red-600 hover:bg-red-100 rounded-lg"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default EventItem;