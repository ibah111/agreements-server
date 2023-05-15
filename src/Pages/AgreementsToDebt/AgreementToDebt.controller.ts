import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AgreementToDebtInput,
  DeleteAgrementToDebtInput,
  GetAllowedDebtsInput,
} from './AgreementToDebt.input';
import { AgreementToDebtSerivce } from './AgreementToDebt.service';

@ApiTags('AgreementToDebt')
@Controller('AgreementToDebt')
export class AgreementToDebtController {
  constructor(private readonly service: AgreementToDebtSerivce) {}
  @Post()
  agreementToDebt(@Body() body: AgreementToDebtInput) {
    return this.service.createAgreementToDebt(body);
  }

  @Delete()
  deleteAgreementToDebt(@Body() body: DeleteAgrementToDebtInput) {
    return this.service.deleteAgreementToDebt(body);
  }

  @Get(':id')
  getAgreementToDebt(@Param('id', ParseIntPipe) id: number) {
    return this.service.getAgreementDebts(id);
  }

  @Post('getAllowedDebts')
  getAllowedDebts(@Body() body: GetAllowedDebtsInput) {
    return this.service.getAllowedDebts(body.id_agreement);
  }
}
