import { registerAs } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';

import { configCache } from './consts';

let config: any = {
  store: redisStore,
  ttl: 24 * 3600,
};

export default registerAs(configCache, () => {
  if (process.env.REDIS_CLUSTER === 'true') {
    config = {
      ...config,
      clusterConfig: {
        nodes: [
          {
            port: process.env.REDIS_PORT,
            host: process.env.REDIS_HOST,
          },
        ],
        options: {
          maxRedirections: 16,
          slotsRefreshTimeout: 2000,
          password: process.env.REDIS_PASSWORD,
        },
      },
    };
  } else {
    config = {
      ...config,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0', 10),
      ttl: 3600, // 1 hour
      tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
    };
  }

  return config;
});
