import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { DebtService } from './Debt.service';

@ApiTags('Debt')
@Controller('Debt')
@ApiBasicAuth()
export class DebtController {
  constructor(private readonly service: DebtService) {}
  @Get('/Person/:id')
  getDebtPerson(@Param('id', ParseIntPipe) id: number) {
    return this.service.getPersonDebts(id);
  }

  @Get('/Payments/:id')
  getAllPayments(@Param('id', ParseIntPipe) id: number) {
    return this.service.getAllDebtPayments(id);
  }
}
