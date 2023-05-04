import { Debt, Person } from '@contact/models';
import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import AgreementDebtsLink from 'src/Modules/Database/Local.Database/models/AgreementDebtLink';
import { AgreementToDebtController } from './AgreementToDebt.controller';
import { AgreementToDebtSerivce } from './AgreementToDebt.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Debt, Person], 'contact'),
    SequelizeModule.forFeature([Agreement, AgreementDebtsLink], 'local'),
  ],
  controllers: [AgreementToDebtController],
  providers: [AgreementToDebtSerivce],
})
export class AgreementToDebtModule {}
