import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { PersonPropertyService } from './PersonProperty.service';
import { PersonProperty } from '@contact/models';
import { PersonPropertyController } from './PersonProperty.controller';
import { Agreement } from '../../Modules/Database/Local.Database/models/Agreement';
import AgreementToPersonProperties from '../../Modules/Database/Local.Database/models/AgreementToPersonProperties';

@Module({
  imports: [
    SequelizeModule.forFeature([PersonProperty], 'contact'),
    SequelizeModule.forFeature(
      [Agreement, AgreementToPersonProperties],
      'local',
    ),
  ],
  providers: [PersonPropertyService],
  controllers: [PersonPropertyController],
})
export class PersonPropertiesModule {}
