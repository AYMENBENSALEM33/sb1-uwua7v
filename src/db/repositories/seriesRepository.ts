import { Series, NewSeries, UpdateSeries } from '../../models/Series';
import { getDB } from '../connection';

export class SeriesRepository {
  async create(series: NewSeries): Promise<Series> {
    const db = await getDB();
    const tx = db.transaction('series', 'readwrite');
    
    // Get max order
    const allSeries = await tx.store.getAll();
    const maxOrder = Math.max(...allSeries.map(s => s.order), -1);
    
    const now = new Date().toISOString();
    const newSeries: Series = {
      ...series,
      id: Date.now(),
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now
    };

    await tx.store.put(newSeries);
    await tx.done;
    return newSeries;
  }

  async update(id: number, series: UpdateSeries): Promise<void> {
    const db = await getDB();
    const tx = db.transaction('series', 'readwrite');
    const existing = await tx.store.get(id);
    if (!existing) return;

    const updatedSeries = {
      ...existing,
      ...series,
      updatedAt: new Date().toISOString()
    };

    await tx.store.put(updatedSeries);
    await tx.done;
  }

  async delete(id: number): Promise<void> {
    const db = await getDB();
    const tx = db.transaction(['series', 'events'], 'readwrite');
    
    // Delete all events in the series
    const eventStore = tx.objectStore('events');
    const eventIndex = eventStore.index('by-series');
    const eventKeys = await eventIndex.getAllKeys(id);
    await Promise.all(eventKeys.map(key => eventStore.delete(key)));
    
    // Delete the series
    await tx.objectStore('series').delete(id);
    await tx.done;
  }

  async findById(id: number): Promise<Series | undefined> {
    const db = await getDB();
    return db.get('series', id);
  }

  async findAll(): Promise<Series[]> {
    const db = await getDB();
    const series = await db.getAll('series');
    return series.sort((a, b) => a.order - b.order);
  }

  async reorder(sourceId: number, targetId: number): Promise<void> {
    const db = await getDB();
    const tx = db.transaction('series', 'readwrite');
    
    const source = await tx.store.get(sourceId);
    const target = await tx.store.get(targetId);
    if (!source || !target) return;

    const sourceOrder = source.order;
    const targetOrder = target.order;
    
    const allSeries = await tx.store.getAll();
    
    for (const series of allSeries) {
      if (sourceOrder < targetOrder) {
        if (series.order > sourceOrder && series.order <= targetOrder) {
          series.order--;
          await tx.store.put(series);
        }
      } else {
        if (series.order >= targetOrder && series.order < sourceOrder) {
          series.order++;
          await tx.store.put(series);
        }
      }
    }
    
    source.order = targetOrder;
    await tx.store.put(source);
    await tx.done;
  }
}

export const seriesRepository = new SeriesRepository();