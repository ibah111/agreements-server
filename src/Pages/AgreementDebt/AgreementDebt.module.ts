import { Debt, DebtCalc } from '@contact/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { DebtController } from './AgreementDebt.controller';
import { DebtService } from './AgreementDebt.service';

@Module({
  imports: [SequelizeModule.forFeature([Debt, DebtCalc], 'contact')],
  controllers: [DebtController],
  providers: [DebtService],
})
export class DebtModule {}
