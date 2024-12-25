import { registerAs } from '@nestjs/config';
import { format, transports, transport } from 'winston';
import * as Sentry from 'winston-transport-sentry-node';
import { PackageInfo } from './package.info';

export default registerAs('log', () => {
  const configTransports: transport[] = [
    new transports.Console({ level: 'info', silent: process.env.NODE_ENV === 'test' }),
  ];

  if (process.env.NODE_ENV === 'production') {
    const SentryDefault = Sentry.default;

    const sentryFormat = format((info) => {
      const { userAgent, ...extra } = info;

      return {
        ...extra,
        tags: {
          userAgent: userAgent || '',
          name: PackageInfo.name,
          pkgDesc: PackageInfo.description || 'none',
          version: PackageInfo.version,
        },
      };
    });

    const SentryOptions = {
      sentry: {
        dsn: process.env.SENTRY_DSN,
      },
      level: 'error',
      environment: 'production',
      format: sentryFormat(),
    };

    configTransports.push(new SentryDefault(SentryOptions));
  }

  return {
    transports: configTransports,
  };
});
