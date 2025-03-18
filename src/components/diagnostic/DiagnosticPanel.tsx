import React, { useState } from 'react';
import { useEventStore } from '../../store/eventStore';
import { useServiceDesk } from '../../hooks/useServiceDesk';
import { Wifi, Download, Upload, Activity } from 'lucide-react';
import { DateRangePicker } from '../common/DateRangePicker';

const DiagnosticPanel: React.FC = () => {
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
    <div className="bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">Diagnostics & Sync</h2>
        </div>
      </div>

      <div className="p-4">
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
            <span>Test Connection</span>
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
            <span>Download Events</span>
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
              {isLoading ? 'Syncing...' : 'Send Events'}
            </span>
          </button>
        </div>

        {error && (
          <div className="p-4 mt-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {showDatePicker && (
          <DateRangePicker
            isOpen={showDatePicker}
            onClose={() => setShowDatePicker(false)}
            onSubmit={handleDownload}
            title="Select Date Range"
          />
        )}
      </div>
    </div>
  );
};

export default DiagnosticPanel;