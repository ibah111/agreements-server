import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Body, Delete, Post } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { CheckCan } from 'src/Modules/Casl/Can.decorators';
import { Action } from 'src/Modules/Casl/casl-ability.factory';
import { CreateAgreementInput, DeleteSelectedAgreements } from './Agr.input';
import { AgreementsService } from './Agr.service';
import { Auth, AuthResult } from 'src/Modules/Guards/auth.guard';
import { AuthGuard } from '../../Modules/Guards/auth.guard';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import { CanGuard } from 'src/Modules/Casl/Can.guard';
import { Portfolio } from '@contact/models';
import { DataGridClass } from '../DataGridClass/DataGridClass';
@ApiTags('Agreements')
@UseGuards(CanGuard)
@UseGuards(AuthGuard)
@Controller('Agreements')
@ApiBasicAuth()
export class AgreementsController {
  constructor(private readonly service: AgreementsService) {}

  @CheckCan((ability) => ability.can(Action.Create, Agreement))
  @Post()
  createAgreement(
    @Auth() auth: AuthResult,
    @Body() body: CreateAgreementInput,
  ) {
    return this.service.сreateAgreement(auth, body);
  }

  @CheckCan((ability) => ability.can(Action.Read, Portfolio))
  @Get('/portfolio')
  getPortfolios() {
    return this.service.getPortfolios();
  }

  @CheckCan((ability) => ability.can(Action.Read, Agreement))
  @Post('/all')
  getAll(@Body() body: DataGridClass) {
    return this.service.getAll(body);
  }

  @CheckCan((ability) => ability.can(Action.Read, Agreement))
  @Get(':id')
  getAgreement(@Param('id', ParseIntPipe) id: number) {
    return this.service.getAgreement(id);
  }

  @CheckCan((ability) => ability.can(Action.Delete, Agreement))
  @Delete(':id')
  deleteAgreement(
    @Auth() auth: AuthResult,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.deleteAgreement(auth, id);
  }

  @CheckCan((ability) => ability.can(Action.Update, Agreement))
  @Delete()
  DeleteSelectedAgreements(@Body() body: DeleteSelectedAgreements) {
    return this.service.deleteSelectedAgreements(body.list);
  }

  @CheckCan((ability) => ability.can(Action.Update, Agreement))
  @Patch(':id')
  editAgreement(
    @Auth() auth: AuthResult,
    @Param('id') id: number,
    @Body() data: any,
  ) {
    return this.service.editAgreement(auth, id, data);
  }

  @CheckCan((ability) => ability.can(Action.UpdateAll, Agreement))
  @Post('syncAll')
  syncContactData() {
    return this.service.syncronize();
  }

  @CheckCan((ability) => ability.can(Action.Update, Agreement))
  @Patch('syncOne/:id')
  updateCurrentAgreement(@Param('id') id_agr: number) {
    const single_sync = this.service.singleSync(id_agr);
    return single_sync;
  }

  @Get('findAllByPersonId/:person_id')
  findAllByPersonId(@Param('person_id') person_id: number) {
    return this.service.findAllByPersonId(person_id);
  }
}
