import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Logger } from 'winston';
import { GLOBAL_CACHE_MANAGER } from '../cache';

/* istanbul ignore next */
@Injectable()
export class CacheService {
  constructor(
    @Inject(GLOBAL_CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  /* istanbul ignore next */
  removeCacheKeysByPrefix(prefix: string): void {
    // @ts-ignore
    const cacheClient = this.cacheManager.store.getClient();
    const stream = cacheClient.scanStream({ match: `${prefix}:*`, count: 100 });
    const pipeline = cacheClient.pipeline();

    stream.on('data', (resultKeys: any) => {
      // `resultKeys` is an array of strings representing key names.
      pipeline.unlink(resultKeys);
    });

    stream.on('end', () => {
      pipeline.exec(() => {
        this.logger.info('Delete All Match Cache Keys');
      });
    });

    stream.on('error', (error: any) => {
      this.logger.error('Delete Cache Keys Error: ', {
        error,
      });
    });
  }

  /* istanbul ignore next */
  // WARNING: Use for testing only
  async removeAllKeys(): Promise<void> {
    await this.cacheManager.reset();
  }
}
