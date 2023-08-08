import {
  Debt,
  LawAct,
  LawExec,
  Person,
  PersonProperty,
  Portfolio,
  User as UserContact,
} from '@contact/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { ActionLog } from 'src/Modules/Database/Local.Database/models/ActionLog';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import AgreementDebtsLink from 'src/Modules/Database/Local.Database/models/AgreementDebtLink';
import { AgreementsController } from './Agr.controller';
import { AgreementsService } from './Agr.service';
import { Comment } from '../../Modules/Database/Local.Database/models/Comment';
import { PersonPreview } from '../../Modules/Database/Local.Database/models/PersonPreview';
import { PreviewGeneratorModule } from '../../Modules/PreviewGenerator/PreviewGenerator.module';

@Module({
  imports: [
    SequelizeModule.forFeature(
      [LawAct, Person, Debt, PersonProperty, LawExec, Portfolio, UserContact],
      'contact',
    ),
    SequelizeModule.forFeature(
      [Agreement, ActionLog, AgreementDebtsLink, Comment, PersonPreview],
      'local',
    ),
    PreviewGeneratorModule /** модуль содержащий PGService */,
  ],
  controllers: [AgreementsController],
  providers: [AgreementsService],
})
export class AgreementsModule {}
