import React, { useState } from 'react';
import { useEventStore } from '../store/eventStore';
import { useServiceDesk } from '../hooks/useServiceDesk';
import { RefreshCw, Wifi, Download, Upload } from 'lucide-react';
import SyncLogsViewer from './SyncLogsViewer';
import DateRangePicker from './DateRangePicker';

const ServiceDeskSync: React.FC = () => {
  const { events } = useEventStore();
  const { isLoading, error, syncEventsWithServiceDesk, downloadEvents, testServiceDeskConnection } = useServiceDesk();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSync = async () => {
    await syncEventsWithServiceDesk(events);
  };

  const handleDownload = async (startDate: Date, endDate: Date) => {
    await downloadEvents(startDate, endDate);
    setShowDatePicker(false);
  };

  const handleTest = async () => {
    await testServiceDeskConnection();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={handleTest}
          disabled={isLoading}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isLoading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <Wifi className="w-4 h-4" />
          <span>Tester la connexion</span>
        </button>

        <button
          onClick={() => setShowDatePicker(true)}
          disabled={isLoading}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isLoading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Télécharger les événements</span>
        </button>

        <button
          onClick={handleSync}
          disabled={isLoading}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isLoading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          <Upload className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Synchronisation...' : 'Envoyer les événements'}</span>
        </button>
        
        <SyncLogsViewer />
      </div>
      
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      {showDatePicker && (
        <DateRangePicker
          onSubmit={handleDownload}
          onCancel={() => setShowDatePicker(false)}
        />
      )}
    </div>
  );
};

export default ServiceDeskSync;