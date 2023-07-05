import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Debt, DebtCalc } from '@contact/models';
@Injectable()
export class DebtService {
  constructor(
    @InjectModel(Debt, 'contact')
    private readonly modelDebt: typeof Debt,
    @InjectModel(DebtCalc, 'contact')
    private readonly modelDebtCalc: typeof DebtCalc,
  ) {}

  async getPersonDebts(id: number) {
    const Debt = await this.modelDebt.findByPk(id, {
      rejectOnEmpty: new NotFoundException('Не найдены долги'),
    });
    return Debt;
  }
  async getAllPersonDebts(parent_id: number) {
    const AllDebts = await this.modelDebt.findAll({
      where: {
        parent_id: parent_id,
      },
    });
    return AllDebts;
  }
  async getAllDebtPayments(parent_id: number) {
    const AllPayments = await this.modelDebtCalc.findAll({
      where: {
        parent_id: parent_id,
      },
      include: ['PurposeDict'],
    });

    return AllPayments;
  }
}
