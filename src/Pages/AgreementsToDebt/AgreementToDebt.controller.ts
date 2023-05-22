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
import { ApiTags } from '@nestjs/swagger';
import { CanGuard } from 'src/Modules/Casl/Can.guard';
import { Auth, AuthGuard, AuthResult } from 'src/Modules/Guards/auth.guard';
import {
  AgreementToDebtInput,
  DeleteAgrementToDebtInput,
  GetAllowedDebtsInput,
} from './AgreementToDebt.input';
import { AgreementToDebtSerivce } from './AgreementToDebt.service';

@ApiTags('AgreementToDebt')
@UseGuards(CanGuard)
@UseGuards(AuthGuard)
@Controller('AgreementToDebt')
export class AgreementToDebtController {
  constructor(private readonly service: AgreementToDebtSerivce) {}
  @Post()
  agreementToDebt(
    @Auth() auth: AuthResult,
    @Body() body: AgreementToDebtInput,
  ) {
    return this.service.createAgreementToDebt(auth, body);
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
