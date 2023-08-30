import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './Cron.service';
import { PreviewGeneratorModule } from '../PreviewGenerator/PreviewGenerator.module';
import { PaymentsModule } from '../../Pages/Payments/Payments.module';

@Module({
  imports: [ScheduleModule.forRoot(), PreviewGeneratorModule, PaymentsModule],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
