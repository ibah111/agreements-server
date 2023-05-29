import { Dict } from '@contact/models';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Module } from '@nestjs/common';
import { DictController } from './Dict.controller';
import { DictService } from './Dict.service';

@Module({
  imports: [SequelizeModule.forFeature([Dict], 'contact')],
  controllers: [DictController],
  providers: [DictService],
})
export class DictModule {}
