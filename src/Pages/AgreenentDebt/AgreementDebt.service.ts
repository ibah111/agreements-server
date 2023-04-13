import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Debt } from '@contact/models';
@Injectable()
export class DebtService {
  constructor(
    @InjectModel(Debt, 'contact')
    private readonly modelDebt: typeof Debt,
  ) {}

  async getPersonDebts(id: number) {
    const Debt = await this.modelDebt.findByPk(id, {
      rejectOnEmpty: new NotFoundException('Не найдены долги'),
    });
    return Debt;
  }
  // async getAllPersonDebts(parent_id: number) {
  //   const AllDebts = await this.modelDebt.findAll({
  //     where: {
  //       parent_id: parent_id,
  //     },
  //   });
  //   return AllDebts;
  // }
}
