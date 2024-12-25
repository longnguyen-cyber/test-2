import { BullModule } from '@nestjs/bull';
import {
  CacheModuleOptions,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import helmet from 'helmet';
import { WinstonModule, WinstonModuleOptions } from 'nest-winston';
import { Logger } from 'winston';
import { GLOBAL_CACHE_MANAGER, GlobalCacheModule } from './common/cache';
import { GlobalHandleExceptionFilter } from './common/exception';
import { HtmlTemplateModule } from './common/html-templates';
import { LoggerMiddleware } from './common/middleware';
import { ShutdownObserver } from './common/observers';
import { CacheService } from './common/services';
import configurations from './config';
import { configBull, configCache, configDb, configLog } from './config/consts';
import { AuthModule } from './modules/auth/auth.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { HealthzModule } from './modules/healthz/healthz.module';
import { MiningModule } from './modules/mining/mining.module';
import { ReferralModule } from './modules/referral/referral.module';
import { TaskModule } from './modules/task/task.module';
import { TopicModule } from './modules/topic/topic.module';
import { TranslationModule } from './modules/translation/translation.module';
import { UserModule } from './modules/user/user.module';
import { VersionModule } from './modules/version/version.module';
import { Web3Module } from './modules/web3/web3.module';
import { NoticeModule } from './modules/notice/notice.module';
const modules = [
  HealthzModule,
  AuthModule,
  UserModule,
  TopicModule,
  TaskModule,
  MiningModule,
  FeedbackModule,
  ReferralModule,
  VersionModule,
  Web3Module,
  TranslationModule,
  NoticeModule,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configurations,
      isGlobal: true,
      envFilePath: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env',
    }),
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const config = configService.get<WinstonModuleOptions>(configLog);
        if (!config) {
          throw new Error('Cannot start app without winston config');
        }
        return config;
      },
      inject: [ConfigService],
    }),
    // I18nModule.forRootAsync({
    //   useFactory: () => ({
    //     fallbackLanguage: 'vi',
    //     loaderOptions: {
    //       path: join(__dirname, '/i18n/'),
    //       watch: true,
    //     },
    //   }),
    //   resolvers: [
    //     new QueryResolver(['lang', 'l']),
    //     new HeaderResolver(['x-custom-lang']),
    //     new CookieResolver(),
    //     AcceptLanguageResolver,
    //   ],
    // }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const config = configService.get<TypeOrmModuleOptions>(configDb);
        if (!config) {
          throw new Error('Cannot start app without ORM config');
        }
        return config;
      },
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const config = configService.get(configBull);
        if (!config) {
          throw new Error('Cannot start app without Bull config');
        }
        return config;
      },
      inject: [ConfigService],
    }),
    ShutdownObserver,
    GlobalCacheModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const configOfCache = configService.get<CacheModuleOptions>(configCache);
        if (!configOfCache) {
          throw new Error('Cannot start without Cache config');
        }
        return configOfCache;
      },
      inject: [ConfigService],
    }),
    HtmlTemplateModule.register({
      root: __dirname,
      templateDir: './templates',
    }),
    ...modules,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalHandleExceptionFilter,
    },
    CacheService,
    ShutdownObserver,
  ],
})
export class MainModule implements OnModuleDestroy, NestModule, OnApplicationBootstrap {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    @Inject(GLOBAL_CACHE_MANAGER)
    private readonly cacheManager?: Cache,
  ) {}

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(helmet()).forRoutes('*');
    consumer.apply(LoggerMiddleware).exclude('healthz').forRoutes('*');
  }

  onApplicationBootstrap(): void {
    process.on('uncaughtException', (error) => {
      this.logger.error('uncaughtException error: ', error);
    });
  }

  onModuleDestroy(): void {
    this.logger.info('Main module is destroying...');

    if (this.cacheManager) {
      // @ts-ignore
      const cacheClient = this.cacheManager.store.getClient();
      if (cacheClient) {
        cacheClient.disconnect();
      }
    }
  }
}
