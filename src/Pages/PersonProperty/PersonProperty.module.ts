import { Module } from '@nestjs/common';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { PersonPropertyService } from './PersonProperty.service';
import { PersonProperty } from '@contact/models';
import { PersonPropertyController } from './PersonProperty.controller';

@Module({
  imports: [SequelizeModule.forFeature([PersonProperty], 'contact')],
  providers: [PersonPropertyService],
  controllers: [PersonPropertyController],
})
export class PersonPropertiesModule {}
