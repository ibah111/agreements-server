import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './Cron.service';
import { PreviewGeneratorModule } from '../PreviewGenerator/PreviewGenerator.module';

@Module({
  imports: [ScheduleModule.forRoot(), PreviewGeneratorModule],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
