import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
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
  private readonly logger = new Logger(CronService.name);

  @Cron('5 * * * * * ')
  handleCron() {
    console.log('Отправляет эту строку каждые 5 секунд');
    this.logger.debug('Cron is working');
  }
}
