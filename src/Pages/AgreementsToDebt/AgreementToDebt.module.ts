import { Debt, Dict, Person } from '@contact/models';
import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import AgreementDebtsLink from 'src/Modules/Database/Local.Database/models/AgreementDebtLink';
import { AgreementToDebtController } from './AgreementToDebt.controller';
import { AgreementToDebtSerivce } from './AgreementToDebt.service';
import { PersonPreview } from '../../Modules/Database/Local.Database/models/PersonPreview';
import { PreviewGeneratorModule } from '../../Modules/PreviewGenerator/PreviewGenerator.module';

@Module({
  imports: [
    PreviewGeneratorModule,
    SequelizeModule.forFeature([Debt, Person, Dict], 'contact'),
    SequelizeModule.forFeature(
      [Agreement, AgreementDebtsLink, PersonPreview],
      'local',
    ),
  ],
  controllers: [AgreementToDebtController],
  providers: [AgreementToDebtSerivce],
})
export class AgreementToDebtModule {}
