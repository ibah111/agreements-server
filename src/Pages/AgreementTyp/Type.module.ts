import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { TypeAgreement } from 'src/Modules/Database/Local.Database/models/AgreementType';
import TypeController from './Type.controller';
import TypeService from './Type.service';

@Module({
  imports: [SequelizeModule.forFeature([TypeAgreement], 'local')],
  providers: [TypeService],
  controllers: [TypeController],
})
export class TypeAgreementModule {}
