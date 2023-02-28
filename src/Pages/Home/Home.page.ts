import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Paper } from 'src/Modules/LocalDatabase/Models/Paper';

import { HomeController } from './Home.controller';
import { HomeService } from './Home.service';

@Module({
  controllers: [HomeController],
  providers: [HomeService],
  imports: [SequelizeModule.forFeature([Paper])],
})
export class HomePage {}
