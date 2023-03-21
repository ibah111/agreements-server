import { Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { Body, Delete, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckCan } from 'src/Modules/Casl/Can.decorators';
import { Action } from 'src/Modules/Casl/casl-ability.factory';
import { CreateAgreementInput, EditAgreementInput } from './Agr.input';
import { AgreementsService } from './Agr.service';
import { User } from 'src/Modules/Database/local.database/models/User.model';
@ApiTags('Agreements')
@Controller('Agreements')
export class AgreementsController {
  constructor(private readonly service: AgreementsService) {}

  @CheckCan((ability) => ability.can(Action.Create, User))
  @Post()
  createAgreement(@Body() body: CreateAgreementInput) {
    return this.service.CreateAgreement(body);
  }

  @CheckCan((ability) => ability.can(Action.Create, User))
  @Get(':id')
  getAgreement(@Param('id', ParseIntPipe) id: number) {
    return this.service.getAgreement(id);
  }

  @CheckCan((ability) => ability.can(Action.Create, User))
  @Delete(':id')
  deleteAgreement(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteAgreement(id);
  }

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @CheckCan((ability) => ability.can(Action.Create, User))
  @Patch(':id')
  editAgreement(@Param('id') id: number, @Body() data: EditAgreementInput) {
    return this.service.editAgreement(id, data);
  }
}
