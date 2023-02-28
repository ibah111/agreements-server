import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Person } from 'src/Modules/LocalDatabase/Models/person';

import { HomeController } from './Home.controller';
import { HomeService } from './Home.service';

@Module({
  controllers: [HomeController],
  providers: [HomeService],
  imports: [SequelizeModule.forFeature([Person])],
})
export class HomePage {}
