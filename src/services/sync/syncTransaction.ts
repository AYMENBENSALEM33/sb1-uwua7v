import { LoggerService } from '../api/logger';
import { cacheService } from '../cache';

const logger = new LoggerService();

export class SyncTransaction {
  private operations: (() => Promise<void>)[] = [];
  private rollbackOperations: (() => Promise<void>)[] = [];

  async execute(operation: () => Promise<void>, rollback: () => Promise<void>): Promise<void> {
    this.operations.push(operation);
    this.rollbackOperations.push(rollback);
  }

  async commit(): Promise<void> {
    try {
      for (const operation of this.operations) {
        await operation();
      }
      
      // Clear cache after successful commit
      cacheService.clear();
      logger.success('Transaction committed successfully');
    } catch (error) {
      logger.error(`Transaction failed: ${error}`);
      await this.rollback();
      throw error;
    }
  }

  private async rollback(): Promise<void> {
    logger.warning('Rolling back transaction');
    
    for (const rollbackOp of this.rollbackOperations.reverse()) {
      try {
        await rollbackOp();
      } catch (error) {
        logger.error(`Rollback operation failed: ${error}`);
      }
    }
    
    logger.info('Rollback completed');
  }
}