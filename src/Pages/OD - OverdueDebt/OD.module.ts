import { Debt, DebtCalc, Person } from '@contact/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import AgreementDebtsLink from 'src/Modules/Database/Local.Database/models/AgreementDebtLink';

@Module({
  imports: [
    SequelizeModule.forFeature([Debt, DebtCalc, Person], 'contact'),
    SequelizeModule.forFeature([Agreement, AgreementDebtsLink], 'local'),
  ],
  /**
   * Контроллеры
   */
  controllers: [],
  /**
   * service
   */
  providers: [],
})
export class OverdueModule {}
