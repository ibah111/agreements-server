import { Debt, DebtCalc } from '@contact/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { DebtController } from './Debt.controller';
import { DebtService } from './Debt.service';

@Module({
  imports: [SequelizeModule.forFeature([Debt, DebtCalc], 'contact')],
  controllers: [DebtController],
  providers: [DebtService],
})
export class DebtModule {}
