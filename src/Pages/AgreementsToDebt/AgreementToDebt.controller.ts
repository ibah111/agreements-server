import { Post } from '@nestjs/common';
import { AgreementToDebtSerivce } from './AgreementToDebt.service';

export class AgreementToDebtController {
  constructor(private readonly service: AgreementToDebtSerivce) {}
  @Post()
  agreementToDebtConnection() {
    return;
  }
}
