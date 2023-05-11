import { Debt, LawAct, Person, PersonProperty } from '@contact/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { ActionLog } from 'src/Modules/Database/Local.Database/models/ActionLog';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import AgreementDebtsLink from 'src/Modules/Database/Local.Database/models/AgreementDebtLink';
import { AgreementsController } from './Agr.controller';
import { AgreementsService } from './Agr.service';

@Module({
  imports: [
    SequelizeModule.forFeature(
      [LawAct, Person, Debt, PersonProperty],
      'contact',
    ),
    SequelizeModule.forFeature(
      [Agreement, ActionLog, AgreementDebtsLink],
      'local',
    ),
  ],
  controllers: [AgreementsController],
  providers: [AgreementsService],
})
export class AgreementsModule {}
