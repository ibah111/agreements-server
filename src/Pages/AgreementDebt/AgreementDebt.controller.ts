import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { CheckCan } from 'src/Modules/Casl/Can.decorators';
import { CanGuard } from 'src/Modules/Casl/Can.guard';
import { Action } from 'src/Modules/Casl/casl-ability.factory';
import { User } from 'src/Modules/Database/Local.Database/models/User.model';
import { AuthGuard } from 'src/Modules/Guards/auth.guard';
import { DebtService } from './AgreementDebt.service';

@ApiTags('Debt')
@UseGuards(CanGuard)
@UseGuards(AuthGuard)
@Controller('Debt')
@ApiBasicAuth()
export class DebtController {
  constructor(private readonly service: DebtService) {}
  @CheckCan((ability) => ability.can(Action.Read, User))
  @Get(':id')
  getDebtPerson(@Param('id', ParseIntPipe) id: number) {
    return this.service.getPersonDebts(id);
  }

  @CheckCan((ability) => ability.can(Action.Read, User))
  @Get('/Payments/:id')
  getAllPayments(@Param('id', ParseIntPipe) id: number) {
    return this.service.getAllDebtPayments(id);
  }
}
