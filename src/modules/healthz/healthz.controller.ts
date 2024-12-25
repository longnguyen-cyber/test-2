import { Controller, Get, OnModuleDestroy } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { InjectDataSource } from '@nestjs/typeorm';
import { SeimInternalServerError } from 'src/common/exception';
import { DataSource } from 'typeorm';
// import { I18nTranslations } from '../../generated/i18n.generated';
@Controller('healthz')
export class HealthzController implements OnModuleDestroy {
  isServiceOnline = true;

  constructor(
    private health: HealthCheckService,
    @InjectDataSource()
    private dbConnection: DataSource,
    private db: TypeOrmHealthIndicator,
  ) {}

  onModuleDestroy(): void {
    this.isServiceOnline = false;
  }

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    if (!this.isServiceOnline) {
      throw new SeimInternalServerError('Service is offline');
    }
    return this.health.check([
      () => this.db.pingCheck('database', { connection: this.dbConnection }),
    ]);
  }
}
