import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Agreement } from '../../Modules/Database/Local.Database/models/Agreement';
import { PaymentsController } from './Payments.controller';
import { PaymentsService } from './Payments.service';
import { Payments } from '../../Modules/Database/Local.Database/models/Payments';

@Module({
  imports: [SequelizeModule.forFeature([Agreement, Payments], 'local')],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
