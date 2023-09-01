import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { PreviewGeneratorService } from '../PreviewGenerator/PreviewGenerator.service';
import { PaymentsService } from '../../Pages/Payments/Payments.service';

/**
 * @description По скольку я не знаю как работать с кроном
 * и как правильно ему указывать тайминги поэтмоу я оставлю себе подсказку
 * @hint =>
 * -----------
 * * * * * * *
 * | | | | | |
 * | | | | | day of week
 * | | | | months
 * | | | day of month
 * | | hours
 * | minutes
 */
@Injectable()
export class CronService {
  constructor(
    private readonly reg: SchedulerRegistry,
    private readonly sync: PreviewGeneratorService,
    private readonly pays: PaymentsService,
  ) {}
  private readonly logger = new Logger(CronService.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'midnight_update' })
  async syncronize() {
    await this.sync
      .syncPreview()
      .then(() => console.log('Sync preview done'.green));
    /**@TODO needs new method that updates all statuses */
  }
}
