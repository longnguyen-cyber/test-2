import {
  CACHE_MANAGER,
  DynamicModule,
  CacheModuleAsyncOptions,
  CacheModule,
} from '@nestjs/common';

export const GLOBAL_CACHE_MANAGER = 'GLOBAL_CACHE_MANAGER';

export class GlobalCacheModule {
  static registerAsync(options: CacheModuleAsyncOptions): DynamicModule {
    return {
      module: GlobalCacheModule,
      global: true,
      imports: [CacheModule.registerAsync(options)],
      providers: [
        {
          provide: GLOBAL_CACHE_MANAGER,
          useExisting: CACHE_MANAGER,
        },
      ],
      exports: [GLOBAL_CACHE_MANAGER],
    };
  }
}
