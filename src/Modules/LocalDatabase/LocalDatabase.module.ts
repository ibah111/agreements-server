import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { LocalDataBaseService } from './LocalDatabase.service';
import { Movie } from './Models/movie';
import { Person } from './Models/person';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: 'database.sqlite',
      logging: console.log,
      models: [Person, Movie],
    }),
  ],
  providers: [LocalDataBaseService],
})
export class LocalDatabaseModule {}
