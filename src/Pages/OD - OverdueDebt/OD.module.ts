import { Debt, DebtCalc, Person } from '@contact/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import AgreementDebtsLink from 'src/Modules/Database/Local.Database/models/AgreementDebtLink';
import { OverdueDebtsController } from './OD.controller';
import { OverdueService } from './OD.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Debt, DebtCalc, Person], 'contact'),
    SequelizeModule.forFeature([Agreement, AgreementDebtsLink], 'local'),
  ],
  /**
   * Контроллеры
   */
  controllers: [OverdueDebtsController],
  /**
   * service
   */
  providers: [OverdueService],
})
export class OverdueModule {}
