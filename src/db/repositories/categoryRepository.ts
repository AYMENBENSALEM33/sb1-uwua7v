import { EventCategory } from '../../models/Event';
import { getDB } from '../connection';

export class CategoryRepository {
  async create(category: EventCategory): Promise<EventCategory> {
    const db = await getDB();
    const tx = db.transaction('categories', 'readwrite');
    await tx.store.put(category);
    await tx.done;
    return category;
  }

  async update(id: number, category: Partial<EventCategory>): Promise<void> {
    const db = await getDB();
    const tx = db.transaction('categories', 'readwrite');
    const existing = await tx.store.get(id);
    if (!existing) return;

    const updatedCategory = {
      ...existing,
      ...category
    };

    await tx.store.put(updatedCategory);
    await tx.done;
  }

  async delete(id: number): Promise<void> {
    const db = await getDB();
    const tx = db.transaction('categories', 'readwrite');
    await tx.store.delete(id);
    await tx.done;
  }

  async findById(id: number): Promise<EventCategory | undefined> {
    const db = await getDB();
    return db.get('categories', id);
  }

  async findAll(): Promise<EventCategory[]> {
    const db = await getDB();
    const categories = await db.getAll('categories');
    return categories.sort((a, b) => a.order - b.order);
  }
}

export const categoryRepository = new CategoryRepository();