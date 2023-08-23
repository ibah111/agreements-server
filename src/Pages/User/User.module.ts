import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { User } from 'src/Modules/Database/Local.Database/models/User.model';
import { UserController } from './User.controller';
import { UserService } from './User.service';
import { Role } from '../../Modules/Database/Local.Database/models/Role.model';

@Module({
  imports: [SequelizeModule.forFeature([User, Role], 'local')],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
