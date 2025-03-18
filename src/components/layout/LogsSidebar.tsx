import React from 'react';
import { useSyncLogsStore } from '../../store/syncLogsStore';
import { LogCard } from '../logs/LogCard';

export const LogsSidebar = () => {
  const { logs } = useSyncLogsStore();

  return (
    <aside className="w-[15%] h-screen overflow-y-auto custom-scrollbar glassmorphism border-l border-white/10">
      <div className="p-4">
        <h2 className="text-xl font-semibold neon-text mb-4">System Logs</h2>
        <div className="space-y-3">
          {logs.length === 0 ? (
            <div className="text-center text-gray-400 py-4">
              No logs available
            </div>
          ) : (
            logs.map(log => (
              <LogCard key={log.id} log={log} />
            ))
          )}
        </div>
      </div>
    </aside>
  );
};