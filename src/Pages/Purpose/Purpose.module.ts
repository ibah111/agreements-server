import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { PurposeType } from 'src/Modules/Database/Local.Database/models/PurposeType';
import PurposeController from './Purpose.controller';
import PurposeService from './purpose.service';

@Module({
  imports: [SequelizeModule.forFeature([PurposeType], 'local')],
  providers: [PurposeService],
  controllers: [PurposeController],
})
export class PurposeModule {}
