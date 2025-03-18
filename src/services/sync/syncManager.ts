import { Event } from '../../models/Event';
import { eventSyncService } from './eventSyncService';
import { LoggerService } from '../api/logger';
import { eventRepository, seriesRepository } from '../../db';
import { cacheService } from '../cache';

const logger = new LoggerService();

export class SyncManager {
  async performSync(apiEvents: Event[]): Promise<void> {
    try {
      logger.info('Starting sync process', {
        eventCount: apiEvents.length,
        timestamp: new Date().toISOString()
      });

      // Clear cache before sync
      cacheService.clear();

      // Validate series references
      const validationResults = await this.validateSeries(apiEvents);
      logger.debug('Series validation results', validationResults);

      if (validationResults.invalid > 0) {
        logger.warning('Some events have invalid series references', {
          invalidCount: validationResults.invalid,
          invalidIds: validationResults.invalidIds
        });
      }

      // Sync events
      await eventSyncService.syncEvents(apiEvents);

      // Verify results
      const verificationResults = await this.verifySyncResults(apiEvents);
      logger.debug('Sync verification results', verificationResults);

      if (verificationResults.missing.length > 0) {
        logger.warning('Some events failed to sync', {
          missingCount: verificationResults.missing.length,
          missingEvents: verificationResults.missing
        });
      }

      logger.success('Sync completed successfully', {
        processed: apiEvents.length,
        ...verificationResults
      });
    } catch (error) {
      logger.error(`Sync failed`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  private async validateSeries(events: Event[]): Promise<any> {
    const seriesIds = [...new Set(events.map(e => e.seriesId))];
    const existingSeries = await seriesRepository.findAll();
    
    const results = {
      total: seriesIds.length,
      valid: 0,
      invalid: 0,
      invalidIds: [] as number[]
    };

    for (const id of seriesIds) {
      if (existingSeries.find(s => s.id === id)) {
        results.valid++;
      } else {
        results.invalid++;
        results.invalidIds.push(id);
        logger.warning(`Invalid series reference`, {
          seriesId: id,
          affectedEvents: events.filter(e => e.seriesId === id).map(e => ({
            id: e.id,
            name: e.name
          }))
        });
      }
    }

    return results;
  }

  private async verifySyncResults(originalEvents: Event[]): Promise<any> {
    const syncedEvents = await eventRepository.findAll();
    
    const results = {
      total: originalEvents.length,
      synced: syncedEvents.length,
      missing: [] as any[]
    };

    const missingEvents = originalEvents.filter(orig => 
      !syncedEvents.find(synced => synced.id === orig.id)
    );

    if (missingEvents.length > 0) {
      results.missing = missingEvents.map(e => ({
        id: e.id,
        name: e.name,
        seriesId: e.seriesId
      }));

      logger.warning(`Some events failed to sync`, {
        missing: results.missing
      });
    }

    return results;
  }
}