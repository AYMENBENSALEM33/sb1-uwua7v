import React, { useState, useCallback } from 'react';
import { useSyncLogsStore } from '../store/syncLogsStore';
import { ClipboardList, X, Trash2 } from 'lucide-react';
import { generateComponentKey } from '../utils/idGenerator';

const SyncLogsViewer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logs, clearLogs } = useSyncLogsStore();

  const getLogTypeStyle = useCallback((type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  }, []);

  const formatTimestamp = useCallback((timestamp: string) => {
    return new Date(timestamp).toLocaleString('fr-FR');
  }, []);

  const formatLogMessage = useCallback((message: string) => {
    return message.split('\n').map((line, index) => {
      if (line.startsWith('Base URL:') || line.startsWith('URL complète:')) {
        return (
          <div key={generateComponentKey(`line-${index}`)} className="whitespace-pre-wrap font-semibold text-indigo-600">
            {line}
          </div>
        );
      }
      return (
        <div key={generateComponentKey(`line-${index}`)} className="whitespace-pre-wrap">
          {line}
        </div>
      );
    });
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <ClipboardList className="w-4 h-4" />
        <span>Logs de synchronisation</span>
        {logs.length > 0 && (
          <span className="px-2 py-1 text-xs bg-gray-200 rounded-full">
            {logs.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[800px] max-h-[600px] overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
            <h3 className="font-medium">Historique des synchronisations</h3>
            <div className="flex items-center space-x-2">
              {logs.length > 0 && (
                <button
                  onClick={clearLogs}
                  className="p-1 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
                  title="Effacer l'historique"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-2">
            {logs.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                Aucun log de synchronisation
              </p>
            ) : (
              logs.map((log) => (
                <div
                  key={generateComponentKey(`log-${log.id}`)}
                  className={`p-3 rounded-lg font-mono text-sm ${getLogTypeStyle(log.type)}`}
                >
                  <div className="text-xs opacity-75 mb-1">
                    {formatTimestamp(log.timestamp)}
                  </div>
                  <div className="space-y-1">
                    {formatLogMessage(log.message)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(SyncLogsViewer);