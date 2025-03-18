import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Series } from '../models/Series';
import { Event } from '../models/Event';

interface CalendarDB extends DBSchema {
  series: {
    key: number;
    value: Series;
    indexes: { 'by-order': number };
  };
  events: {
    key: number;
    value: Event;
    indexes: { 'by-series': number };
  };
}

class DBConnection {
  private static instance: Promise<IDBPDatabase<CalendarDB>>;
  private static DB_NAME = 'calendar-db';
  private static VERSION = 1;

  private constructor() {}

  public static async getInstance(): Promise<IDBPDatabase<CalendarDB>> {
    if (!DBConnection.instance) {
      DBConnection.instance = openDB<CalendarDB>(DBConnection.DB_NAME, DBConnection.VERSION, {
        upgrade(db) {
          // Create series store
          if (!db.objectStoreNames.contains('series')) {
            const seriesStore = db.createObjectStore('series', {
              keyPath: 'id',
              autoIncrement: false
            });
            seriesStore.createIndex('by-order', 'order', { unique: false });
          }

          // Create events store
          if (!db.objectStoreNames.contains('events')) {
            const eventStore = db.createObjectStore('events', {
              keyPath: 'id',
              autoIncrement: false
            });
            eventStore.createIndex('by-series', 'seriesId', { unique: false });
          }
        },
        blocked() {
          console.warn('Une version plus récente de la base de données est disponible');
        },
        blocking() {
          console.warn('Une version plus ancienne de la base de données est ouverte');
        },
        terminated() {
          console.error('La base de données a été supprimée');
        }
      });
    }
    return DBConnection.instance;
  }

  public static async clearDatabase(): Promise<void> {
    const db = await DBConnection.getInstance();
    const tx = db.transaction(['series', 'events'], 'readwrite');
    await Promise.all([
      tx.objectStore('series').clear(),
      tx.objectStore('events').clear()
    ]);
    await tx.done;
  }
}

export const getDB = () => DBConnection.getInstance();
export const clearDB = () => DBConnection.clearDatabase();