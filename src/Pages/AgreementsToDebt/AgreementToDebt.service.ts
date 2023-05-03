import { Debt } from '@contact/models';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import AgreementDebtsLink from 'src/Modules/Database/Local.Database/models/AgreementDebtLink';
import { AgreementToDebtInput } from './AgreementToDebt.input';

@Injectable()
export class AgreementToDebtSerivce {
  constructor(
    @InjectModel(Debt, 'contact')
    private readonly modelDebt: typeof Debt,
    @InjectModel(AgreementDebtsLink, 'local')
    private readonly modelAgreementDebtsLink: typeof AgreementDebtsLink,
  ) {}
  async createAgreementToDebt(data: AgreementToDebtInput) {
    const agreementToDebt = await this.modelAgreementDebtsLink.create(data);
    return agreementToDebt;
  }
}
