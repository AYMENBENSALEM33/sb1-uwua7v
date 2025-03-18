import React, { useState } from 'react';
import { useEventStore } from '../store/eventStore';
import { useServiceDesk } from '../hooks/useServiceDesk';
import { RefreshCw, Wifi, Download, Upload, Activity } from 'lucide-react';
import SyncLogsViewer from './SyncLogsViewer';
import DateRangePicker from './DateRangePicker';

const DiagnosticPanel: React.FC = () => {
  const { events } = useEventStore();
  const { isLoading, error, syncEventsWithServiceDesk, downloadEvents, testServiceDeskConnection } = useServiceDesk();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeTab, setActiveTab] = useState<'sync' | 'logs'>('sync');

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
    <div className="bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">Diagnostics et Synchronisation</h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('sync')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'sync'
                ? 'bg-indigo-100 text-indigo-700'
                : 'hover:bg-gray-100'
            }`}
          >
            Synchronisation
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'logs'
                ? 'bg-indigo-100 text-indigo-700'
                : 'hover:bg-gray-100'
            }`}
          >
            Logs
          </button>
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'sync' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={handleTest}
                disabled={isLoading}
                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                  isLoading
                    ? 'bg-gray-100 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <Wifi className="w-4 h-4" />
                <span>Tester la connexion</span>
              </button>

              <button
                onClick={() => setShowDatePicker(true)}
                disabled={isLoading}
                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                  isLoading
                    ? 'bg-gray-100 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Télécharger les événements</span>
              </button>

              <button
                onClick={handleSync}
                disabled={isLoading}
                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                  isLoading
                    ? 'bg-gray-100 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                <Upload className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>
                  {isLoading ? 'Synchronisation...' : 'Envoyer les événements'}
                </span>
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}

            {showDatePicker && (
              <DateRangePicker
                onSubmit={handleDownload}
                onCancel={() => setShowDatePicker(false)}
              />
            )}
          </div>
        ) : (
          <div className="h-[500px]">
            <SyncLogsViewer />
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticPanel;