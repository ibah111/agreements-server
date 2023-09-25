import { Debt, DebtCalc, LawAct } from '@contact/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { models } from './models';
import { Agreement } from './models/Agreement';
import AgreementDebtsLink from './models/AgreementDebtLink';
import { User } from './models/User.model';
import { LocalDatabaseSeed } from './seed';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      name: 'local',
      useFactory: (config: ConfigService) => ({
        dialect: 'mssql',
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        host: config.get<string>('database.host'),
        database: config.get<string>('database.database'),
        port: config.get<number>('database.port'),
        logging: false,
        models,
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([User, Agreement, AgreementDebtsLink], 'local'),
    SequelizeModule.forFeature([LawAct, Debt, DebtCalc], 'contact'),
  ],
  providers: [LocalDatabaseSeed],
})
export default class LocalDatabase {}
