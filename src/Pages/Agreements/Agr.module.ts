import { LawAct, Person } from '@contact/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import { AgreementsController } from './Agr.controller';
import { AgreementsService } from './Agr.service';

@Module({
  imports: [
    SequelizeModule.forFeature([LawAct, Person], 'contact'),
    SequelizeModule.forFeature([Agreement], 'local'),
  ],
  controllers: [AgreementsController],
  providers: [AgreementsService],
})
export class AgreementsModule {}
