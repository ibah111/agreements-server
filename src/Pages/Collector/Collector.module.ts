import { Department, User as UserContact } from '@contact/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { CollectorService } from './Collector.service';
import { CollectorController } from './Collector.controller';
import { Collectors } from 'src/Modules/Database/Local.Database/models/Collectors';

@Module({
  imports: [
    SequelizeModule.forFeature([UserContact, Department], 'contact'),
    SequelizeModule.forFeature([Collectors], 'local'),
  ],
  controllers: [CollectorController],
  providers: [CollectorService],
})
export class CollectorModule {}
