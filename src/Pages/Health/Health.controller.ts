import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { SequelizeHealthIndicator } from '@tools/terminus-indicators';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly sql: SequelizeHealthIndicator,
  ) {}
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.sql.pingCheck('database-local', { connection: 'local' }),
      () => this.sql.pingCheck('database-contact', { connection: 'contact' }),
    ]);
  }
}
