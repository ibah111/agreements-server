import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { PreviewGeneratorService } from './PreviewGenerator.service';
import { Debt, Person } from '@contact/models';
import { PersonPreview } from '../Database/Local.Database/models/PersonPreview';
import { Agreement } from '../Database/Local.Database/models/Agreement';
import AgreementDebtsLink from '../Database/Local.Database/models/AgreementDebtLink';
import { Payments } from '../Database/Local.Database/models/Payments';

@Module({
  imports: [
    SequelizeModule.forFeature([Person, Debt], 'contact'),
    SequelizeModule.forFeature(
      [PersonPreview, Agreement, AgreementDebtsLink, Payments],
      'local',
    ),
  ],
  providers: [PreviewGeneratorService],
  exports: [PreviewGeneratorService],
})
export class PreviewGeneratorModule {}
