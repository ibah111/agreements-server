import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Agreement } from '../../Modules/Database/Local.Database/models/Agreement';
import { ActionLog } from '../../Modules/Database/Local.Database/models/ActionLog';
import { AdditionalGridController } from './AG.controller';
import { AdditionalGridService } from './AG.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Agreement, ActionLog], 'local'),
    SequelizeModule.forFeature([], 'contact'),
  ],
  controllers: [AdditionalGridController],
  providers: [AdditionalGridService],
})
export class AdditionalGridModule {}
