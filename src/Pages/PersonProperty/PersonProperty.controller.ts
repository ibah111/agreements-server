import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PersonPropertyService } from './PersonProperty.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('PersonProperty')
@Controller('PersonProperty')
export class PersonPropertyController {
  constructor(private readonly service: PersonPropertyService) {}
  @Get('/:person_id')
  async getPersProp(@Param('person_id', ParseIntPipe) person_id: number) {
    return await this.service.getPersonProperties(person_id);
  }
}
