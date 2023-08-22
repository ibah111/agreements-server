import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Agreement } from '../../Modules/Database/Local.Database/models/Agreement';
import { ActionLog } from '../../Modules/Database/Local.Database/models/ActionLog';
import { AdditionalGridController } from './AG.controller';
import { AdditionalGridService } from './AG.service';
import { User_Role } from '../../Modules/Database/Local.Database/models/User_Role.model';
import { Role } from '../../Modules/Database/Local.Database/models/Role.model';
import { User } from '../../Modules/Database/Local.Database/models/User.model';

@Module({
  imports: [
    SequelizeModule.forFeature(
      [Agreement, ActionLog, User_Role, User, Role],
      'local',
    ),
    SequelizeModule.forFeature([], 'contact'),
  ],
  controllers: [AdditionalGridController],
  providers: [AdditionalGridService],
})
export class AdditionalGridModule {}
