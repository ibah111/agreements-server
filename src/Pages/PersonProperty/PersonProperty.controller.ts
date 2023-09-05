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
import { AuthGuard } from '../../Modules/Guards/auth.guard';
import { CanGuard } from '../../Modules/Casl/Can.guard';
@ApiTags('PersonProperty')
// @UseGuards(CanGuard)
// @UseGuards(AuthGuard)
@Controller('PersonProperty')
export class PersonPropertyController {
  constructor(private readonly service: PersonPropertyService) {}
  @Get('/getPersonProperties/:id_agreement')
  async getPersProp(@Param('id_agreement', ParseIntPipe) id_agreement: number) {
    return await this.service.getPersonProperties(id_agreement);
  }

  @Post('/createLinkPersonPropertyToAgreement')
  async createLinkPersonPropertyToAgreement(
    @Body() body: ActionLinkPersonPropertyInput,
  ) {
    return this.service.createLinkPersonPropertyToAgreement(body);
  }

  @Delete('/deleteLinkPersonPropertyToAgreement')
  async deleteLinkPersonPropertiesToAgreements(
    @Body() body: ActionLinkPersonPropertyInput,
  ) {
    return this.service.deleteLinkPersonProperties(body);
  }

  @Get('/getLinkedProperties/:id_agreement')
  async getAllLinked(
    @Param('id_agreement', ParseIntPipe) id_agreement: number,
  ) {
    return await this.service.getLinkedPersonProperties(id_agreement);
  }
}
