import { Debt } from '@contact/models';
import { UnprocessableEntityException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import AgreementDebtsLink from 'src/Modules/Database/Local.Database/models/AgreementDebtLink';
import {
  AgreementToDebtInput,
  DeleteAgrementToDebtInput,
} from './AgreementToDebt.input';
import { Agreement } from '../../Modules/Database/Local.Database/models/Agreement';

@Injectable()
export class AgreementToDebtSerivce {
  constructor(
    @InjectModel(Debt, 'contact')
    private readonly modelDebt: typeof Debt,
    @InjectModel(AgreementDebtsLink, 'local')
    private readonly modelAgreementDebtsLink: typeof AgreementDebtsLink,
    @InjectModel(Agreement, 'local')
    private readonly modelAgreement: typeof Agreement,
  ) {}
  async createAgreementToDebt(data: AgreementToDebtInput) {
    await this.modelDebt.findByPk(data.id_debt, {
      attributes: ['id'],
      rejectOnEmpty: new UnprocessableEntityException(
        `Долг ${data.id_debt} не найден`,
      ),
    });
    await this.modelAgreement.findByPk(data.id_agreement, {
      attributes: ['id'],
      rejectOnEmpty: new UnprocessableEntityException(
        `Соглашение ${data.id_agreement} не найденно`,
      ),
    });

    const [agreementToDebt] = await this.modelAgreementDebtsLink.findOrCreate({
      where: { id_agreement: data.id_agreement, id_debt: data.id_debt },
      defaults: { id_agreement: data.id_agreement, id_debt: data.id_debt },
    });
    return agreementToDebt;
  }
  async deleteAgreementToDebt(data: DeleteAgrementToDebtInput) {
    const number = await this.modelAgreementDebtsLink.destroy({
      where: { id_agreement: data.id_agreement, id_debt: data.id_debt },
    });
    return number > 0;
  }
  async getAgreementDebts(id: number) {
    const links = await this.modelAgreementDebtsLink.findAll({
      where: { id_agreement: id },
    });
    return links;
  }
}
