import { Controller, Get, Param } from '@nestjs/common';
import { Body, Delete, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckCan } from 'src/Modules/Casl/Can.decorators';
import { Action } from 'src/Modules/Casl/casl-ability.factory';
import { CreateAgreementInput, GetAgreementWith } from './Agr.input';
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
  getAgreement(@Param('id') index: number) {
    return this.service.getAgreement(index);
  }

  @CheckCan((ability) => ability.can(Action.Create, User))
  @Delete(':id')
  deleteAgreement(@Param('id') index: number) {
    return this.service.deleteAgreement(index);
  }

  @Get()
  GetAgreementWith() {
    return this.service.getAgreementWith();
  }
}
