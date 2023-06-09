import { LawExec } from '@contact/models';
import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Op } from '@sql-tools/sequelize';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import AgreementDebtsLink from 'src/Modules/Database/Local.Database/models/AgreementDebtLink';

@Injectable()
export class LawExecDebtService {
  constructor(
    @InjectModel(LawExec, 'contact')
    private readonly modelLawExec: typeof LawExec,
    @InjectModel(Agreement, 'local')
    private readonly modelAgreement: typeof Agreement,
    @InjectModel(AgreementDebtsLink, 'local')
    private readonly modelAgreementDebtsLink: typeof AgreementDebtsLink,
  ) {}

  async getLawExecDebt(agreementId: number) {
    const DebtLinks = await this.modelAgreementDebtsLink.findAll({
      where: { id_agreement: agreementId },
    });
    const debtsIdArray = DebtLinks.map((item) => item.id_debt) || [];

    const lawExecs = await this.modelLawExec.findAll({
      where: { r_debt_id: { [Op.in]: debtsIdArray }, state: 7 },
      include: [{ association: 'StateDict' }],
    });
    return lawExecs;
  }
}
