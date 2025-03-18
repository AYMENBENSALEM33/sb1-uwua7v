import React from 'react';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useEventStore } from '../store/eventStore';

interface EventTableProps {
  isDark: boolean;
  onEdit: (id: number) => void;
}

const EventTable: React.FC<EventTableProps> = ({ isDark, onEdit }) => {
  const { events, deleteEvent, toggleVisibility } = useEventStore();

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <tr>
            <th className="px-6 py-4 text-left">Evennement</th>
            <th className="px-6 py-4 text-left">Date début</th>
            <th className="px-6 py-4 text-left">Date de fin</th>
            <th className="px-6 py-4 text-left">Couleur</th>
            <th className="px-6 py-4 text-left">Visible</th>
            <th className="px-6 py-4 text-left">Position</th>
            <th className="px-6 py-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {events.map((event) => (
            <tr key={event.id} className={`${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
              <td className="px-6 py-4">{event.name}</td>
              <td className="px-6 py-4">{event.startDate}</td>
              <td className="px-6 py-4">{event.endDate}</td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: event.color }} />
                  <span>{event.color}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <button 
                  onClick={() => toggleVisibility(event.id)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {event.visible ? (
                    <Eye className="w-5 h-5 text-green-500" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-red-500" />
                  )}
                </button>
              </td>
              <td className="px-6 py-4">{event.position}</td>
              <td className="px-6 py-4">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onEdit(event.id)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Edit className="w-5 h-5 text-blue-500" />
                  </button>
                  <button 
                    onClick={() => deleteEvent(event.id)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;