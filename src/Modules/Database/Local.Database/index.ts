import { Debt, LawAct } from '@contact/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { models } from './models';
import { Agreement } from './models/Agreement';
import AgreementDebtsLink from './models/AgreementDebtLink';
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
    SequelizeModule.forFeature([User, Agreement, AgreementDebtsLink], 'local'),
    SequelizeModule.forFeature([LawAct, Debt], 'contact'),
  ],
  providers: [LocalDatabaseSeed],
})
export default class LocalDatabase {}
