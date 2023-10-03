import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { PersonPropertyService } from './PersonProperty.service';
import { Person, PersonProperty, PersonPropertyParam } from '@contact/models';
import { PersonPropertyController } from './PersonProperty.controller';
import { Agreement } from '../../Modules/Database/Local.Database/models/Agreement';
import AgreementToPersonProperties from '../../Modules/Database/Local.Database/models/AgreementToPersonProperties';

@Module({
  imports: [
    SequelizeModule.forFeature(
      [Person, PersonProperty, PersonPropertyParam],
      'contact',
    ),
    SequelizeModule.forFeature(
      [Agreement, AgreementToPersonProperties],
      'local',
    ),
  ],
  providers: [PersonPropertyService],
  controllers: [PersonPropertyController],
})
export class PersonPropertiesModule {}
