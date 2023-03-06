import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { models } from './models';
import { User } from './models/User.model';
import { LocalDatabaseSeed } from './seed';

@Module({
  imports: [
    SequelizeModule.forRoot({
      name: 'local',
      dialect: 'sqlite',
      storage: 'database.sqlite',
      logging: false,
      models,
    }),
    SequelizeModule.forFeature([User], 'local'),
  ],
  providers: [LocalDatabaseSeed],
})
export default class LocalDatabase {}
