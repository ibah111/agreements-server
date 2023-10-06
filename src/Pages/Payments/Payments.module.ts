import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Agreement } from '../../Modules/Database/Local.Database/models/Agreement';
import { PaymentsController } from './Payments.controller';
import { PaymentsService } from './Payments.service';
import { Payments } from '../../Modules/Database/Local.Database/models/Payments';
import { Debt, DebtCalc } from '@contact/models';
import { PaymentToCalc } from '../../Modules/Database/Local.Database/models/PaymentToCalc';
import { ScheduleLinks } from '../../Modules/Database/Local.Database/models/SchedulesLinks';
import { ScheduleType } from '../../Modules/Database/Local.Database/models/ScheduleType';
import AgreementDebtsLink from '../../Modules/Database/Local.Database/models/AgreementDebtLink';
import { MathModule } from 'src/Modules/Math/Math.module';

@Module({
  imports: [
    MathModule,
    SequelizeModule.forFeature(
      [
        Agreement,
        AgreementDebtsLink,
        Payments,
        PaymentToCalc,
        ScheduleLinks,
        ScheduleType,
      ],
      'local',
    ),
    SequelizeModule.forFeature([Debt, DebtCalc], 'contact'),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
