import { LawExec, PersonProperty } from '@contact/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import AgreementDebtsLink from 'src/Modules/Database/Local.Database/models/AgreementDebtLink';
import { LawExecDebtController } from './LawExecDebt.controller';
import { LawExecDebtService } from './LawExecDebt.service';

@Module({
  imports: [
    SequelizeModule.forFeature([LawExec, PersonProperty], 'contact'),
    SequelizeModule.forFeature([Agreement, AgreementDebtsLink], 'local'),
  ],
  providers: [LawExecDebtService],
  controllers: [LawExecDebtController],
})
export class LawExecDebtModule {}
