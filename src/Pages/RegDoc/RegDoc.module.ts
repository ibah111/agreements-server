import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { RegDocType } from 'src/Modules/Database/Local.Database/models/RegDocType';
import RegDocController from './RegDoc.controller';
import RegDocService from './RegDoc.service';

@Module({
  imports: [SequelizeModule.forFeature([RegDocType], 'local')],
  providers: [RegDocService],
  controllers: [RegDocController],
})
export class RegDocModule {}
