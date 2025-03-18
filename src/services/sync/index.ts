import { EventSyncService, eventSyncService } from './eventSyncService';
import { SyncManager } from './syncManager';
import { SyncTransaction } from './syncTransaction';

// Create singleton instance
const syncManager = new SyncManager();

export {
  EventSyncService,
  eventSyncService,
  SyncManager,
  syncManager,
  SyncTransaction
};