import React, { useState } from 'react';
import { Eye, EyeOff, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { useEventStore } from '../store/eventStore';
import AddEventModal from './AddEventModal';

interface SeriesConfig {
  id: string;
  name: string;
  color: string;
  description: string;
  filter: (event: any) => boolean;
}

const seriesConfigurations: SeriesConfig[] = [

];

const SeriesSlider: React.FC = () => {
  const { events, toggleVisibility, deleteEvent } = useEventStore();
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const getSeriesVisibility = (seriesId: string): boolean => {
    const seriesEvents = events.filter(event => {
      const series = seriesConfigurations.find(s => s.id === seriesId);
      return series?.filter(event);
    });
    return seriesEvents.some(event => event.visible);
  };

  const toggleSeries = (seriesId: string) => {
    const seriesEvents = events.filter(event => {
      const series = seriesConfigurations.find(s => s.id === seriesId);
      return series?.filter(event);
    });
    seriesEvents.forEach(event => toggleVisibility(event.id));
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (event: any) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      deleteEvent(event.id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const getSeriesEvents = (seriesId: string) => {
    const series = seriesConfigurations.find(s => s.id === seriesId);
    return events.filter(event => series?.filter(event));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-64 flex flex-col max-h-[600px]">
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-800">Séries d'événements</h3>
      </div>
      
      <div className="overflow-y-auto flex-1 p-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {seriesConfigurations.map(series => (
          <div key={series.id} className="bg-white rounded-lg">
            <div 
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-gray-100"
              onClick={() => setSelectedSeries(selectedSeries === series.id ? null : series.id)}
            >
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: series.color }}
                />
                <div>
                  <div className="text-sm font-medium text-gray-700">{series.name}</div>
                  <div className="text-xs text-gray-500">{series.description}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSeries(series.id);
                  }}
                  className={`p-1 rounded-lg transition-colors ${
                    getSeriesVisibility(series.id)
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {getSeriesVisibility(series.id) ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <ChevronRight 
                  className={`w-4 h-4 transition-transform ${
                    selectedSeries === series.id ? 'rotate-90' : ''
                  }`}
                />
              </div>
            </div>

            {selectedSeries === series.id && (
              <div className="mt-1 ml-4 space-y-1 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-1">
                {getSeriesEvents(series.id).map(event => (
                  <div 
                    key={event.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <div className="text-sm font-medium">{event.name}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(event.startDate).toLocaleDateString('fr-FR')}
                        {event.startDate !== event.endDate && 
                          ` - ${new Date(event.endDate).toLocaleDateString('fr-FR')}`
                        }
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="p-1 hover:bg-white rounded-full transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-3 h-3 text-blue-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event)}
                        className="p-1 hover:bg-white rounded-full transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <AddEventModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isDark={false}
        editingEvent={editingEvent}
      />
    </div>
  );
};

export default SeriesSlider;