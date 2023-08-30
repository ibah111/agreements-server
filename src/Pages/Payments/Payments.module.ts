import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Agreement } from '../../Modules/Database/Local.Database/models/Agreement';
import { PaymentsController } from './Payments.controller';
import { PaymentsService } from './Payments.service';
import { Payments } from '../../Modules/Database/Local.Database/models/Payments';
import { Debt, DebtCalc } from '@contact/models';

@Module({
  imports: [
    SequelizeModule.forFeature([Agreement, Payments], 'local'),
    SequelizeModule.forFeature([Debt, DebtCalc], 'contact'),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
