import { LawAct } from '@contact/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { models } from './models';
import { Agreement } from './models/Agreement';
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
    SequelizeModule.forFeature([User, Agreement], 'local'),
    SequelizeModule.forFeature([LawAct], 'contact'),
  ],
  providers: [LocalDatabaseSeed],
})
export default class LocalDatabase {}
