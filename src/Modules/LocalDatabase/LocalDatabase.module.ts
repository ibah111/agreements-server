import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { LocalDataBaseService } from './LocalDatabase.service';

import { Paper } from './Models/Paper';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: 'database.sqlite',
      logging: console.log,
      models: [Paper],
    }),
  ],
  providers: [LocalDataBaseService],
})
export class LocalDatabaseModule {}
