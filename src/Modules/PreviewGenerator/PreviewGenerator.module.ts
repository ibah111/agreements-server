import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { PreviewGeneratorService } from './PreviewGenerator.service';
import { Person } from '@contact/models';
import { PersonPreview } from '../Database/Local.Database/models/PersonPreview';
import { Agreement } from '../Database/Local.Database/models/Agreement';
import AgreementDebtsLink from '../Database/Local.Database/models/AgreementDebtLink';

@Module({
  imports: [
    SequelizeModule.forFeature([Person], 'contact'),
    SequelizeModule.forFeature(
      [PersonPreview, Agreement, AgreementDebtsLink],
      'local',
    ),
  ],
  providers: [PreviewGeneratorService],
  exports: [PreviewGeneratorService],
})
export class PreviewGeneratorModule {}
