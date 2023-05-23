import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { StatusAgreement } from 'src/Modules/Database/Local.Database/models/StatusAgreement';
import StatusAgreementController from './StatusAgreement.controller';
import StatusAgreementService from './StatusAgreement.service';

@Module({
  imports: [SequelizeModule.forFeature([StatusAgreement], 'local')],
  providers: [StatusAgreementService],
  controllers: [StatusAgreementController],
})
export class StatusAgreementModule {}
