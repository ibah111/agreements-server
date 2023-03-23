import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Body, Delete, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckCan } from 'src/Modules/Casl/Can.decorators';
import { Action } from 'src/Modules/Casl/casl-ability.factory';
import { CreateAgreementInput, EditAgreementInput } from './Agr.input';
import { AgreementsService } from './Agr.service';
import { User } from 'src/Modules/Database/Local.Database/models/User.model';
import { Auth, AuthResult } from 'src/Modules/Guards/auth.guard';
import { AuthGuard } from '../../Modules/Guards/auth.guard';
import { CanGuard } from 'src/Modules/Casl/Can.guard';
@ApiTags('Agreements')
@UseGuards(CanGuard)
@UseGuards(AuthGuard)
@Controller('Agreements')
export class AgreementsController {
  constructor(private readonly service: AgreementsService) {}

  @CheckCan((ability) => ability.can(Action.Create, User))
  @Post()
  createAgreement(
    @Auth() auth: AuthResult,
    @Body() body: CreateAgreementInput,
  ) {
    return this.service.CreateAgreement(auth, body);
  }

  @CheckCan((ability) => ability.can(Action.Create, User))
  @Get(':id')
  getAgreement(@Param('id', ParseIntPipe) id: number) {
    return this.service.getAgreement(id);
  }

  @CheckCan((ability) => ability.can(Action.Create, User))
  @Delete(':id')
  deleteAgreement(
    @Auth() auth: AuthResult,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.deleteAgreement(auth, id);
  }

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @CheckCan((ability) => ability.can(Action.Create, User))
  @Patch(':id')
  editAgreement(
    @Auth() auth: AuthResult,
    @Param('id') id: number,
    @Body() data: EditAgreementInput,
  ) {
    return this.service.editAgreement(auth, id, data);
  }
}
