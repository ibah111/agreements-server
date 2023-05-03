import { Debt } from '@contact/models';
import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { AgreementToDebtController } from './AgreementToDebt.controller';
import { AgreementToDebtSerivce } from './AgreementToDebt.service';

@Module({
  imports: [SequelizeModule.forFeature([Debt], 'contact')],
  controllers: [AgreementToDebtController],
  providers: [AgreementToDebtSerivce],
})
export class AgreementToDebtModule {}
