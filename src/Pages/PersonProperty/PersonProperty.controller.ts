import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PersonPropertyService } from './PersonProperty.service';
import { ApiTags } from '@nestjs/swagger';
import { ActionLinkPersonPropertyInput } from './PersonProperty.input';
import { Auth, AuthGuard, AuthResult } from '../../Modules/Guards/auth.guard';
import { CanGuard } from '../../Modules/Casl/Can.guard';
@ApiTags('PersonProperty')
// @UseGuards(CanGuard)
// @UseGuards(AuthGuard)
@Controller('PersonProperty')
export class PersonPropertyController {
  constructor(private readonly service: PersonPropertyService) {}
  @Get('/:person_id')
  async getPersProp(@Param('person_id', ParseIntPipe) person_id: number) {
    return await this.service.getPersonProperties(person_id);
  }
  @Post()
  async createLinkPersonPropertyToAgreement(
    @Body() body: ActionLinkPersonPropertyInput,
  ) {
    return this.service.createLinkPersonPropertyToAgreement(body);
  }

  @Delete()
  async deleteLinkPersonPropertiesToAgreements() {
    return;
  }
}
