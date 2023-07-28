import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PersonPropertyService } from './PersonProperty.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateLinkPersonPropertyInput } from './PersonProperty.input';
import { Auth, AuthResult } from '../../Modules/Guards/auth.guard';
@ApiTags('PersonProperty')
@Controller('PersonProperty')
export class PersonPropertyController {
  constructor(private readonly service: PersonPropertyService) {}
  @Get('/:person_id')
  async getPersProp(@Param('person_id', ParseIntPipe) person_id: number) {
    return await this.service.getPersonProperties(person_id);
  }
  @Post()
  async createLinkPersonPropertyToAgreement(
    @Auth() auth: AuthResult,
    @Body() body: CreateLinkPersonPropertyInput,
  ) {
    return this.service.createLinkPersonPropertyToAgreement(auth, body);
  }

  @Delete()
  async deleteLinkPersonPropertiesToAgreements() {
    return;
  }
}
