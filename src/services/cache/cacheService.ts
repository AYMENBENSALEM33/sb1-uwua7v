import { LoggerService } from '../api/logger';

const logger = new LoggerService();

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export class CacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    });
    logger.info(`Cache: Set ${key} (expires in ${ttl}ms)`);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      logger.info(`Cache: Miss ${key}`);
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      logger.info(`Cache: Expired ${key}`);
      this.cache.delete(key);
      return null;
    }

    logger.info(`Cache: Hit ${key}`);
    return entry.data;
  }

  clear(): void {
    this.cache.clear();
    logger.info('Cache: Cleared');
  }

  invalidate(key: string): void {
    this.cache.delete(key);
    logger.info(`Cache: Invalidated ${key}`);
  }
}

export const cacheService = new CacheService();