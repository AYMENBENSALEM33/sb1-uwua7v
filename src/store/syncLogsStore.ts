import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LogLevel } from '../services/api/logger';

export interface SyncLog {
  id: string;
  timestamp: string;
  message: string;
  type: LogLevel;
}

interface SyncLogsState {
  logs: SyncLog[];
  addLog: (log: Omit<SyncLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
}

export const useSyncLogsStore = create<SyncLogsState>()(
  persist(
    (set) => ({
      logs: [],
      addLog: (log) => {
        const newLog = {
          ...log,
          id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString()
        };
        
        set((state) => ({
          logs: [newLog, ...state.logs.slice(0, 19)]
        }));
      },
      clearLogs: () => set({ logs: [] })
    }),
    {
      name: 'sync-logs',
      version: 1,
      partialize: (state) => ({ logs: state.logs.slice(0, 20) })
    }
  )
);