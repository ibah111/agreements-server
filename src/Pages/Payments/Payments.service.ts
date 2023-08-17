/* eslint-disable @typescript-eslint/no-unused-vars */
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Inject, Injectable } from '@nestjs/common';
import { Payments } from '../../Modules/Database/Local.Database/models/Payments';
import { PaymentsInput, updateStatusInput } from './Payments.input';
import { AuthResult } from '../../Modules/Guards/auth.guard';
import { Agreement } from '../../Modules/Database/Local.Database/models/Agreement';
import { Debt, DebtCalc } from '@contact/models';
import { Op } from '@sql-tools/sequelize';
import moment from 'moment';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payments, 'local')
    private readonly modelPayments: typeof Payments,
    @InjectModel(Agreement, 'local')
    private readonly modelAgreement: typeof Agreement,
    @InjectModel(Debt, 'contact')
    private readonly modelDebt: typeof Debt,
    @InjectModel(DebtCalc, 'contact')
    private readonly modelDebtCalc: typeof DebtCalc,
  ) {}

  async getSchedule(id_agreement: number) {
    return await this.modelPayments.findAll({
      where: {
        id_agreement: id_agreement,
      },
    });
  }
  async createPaymentsSchedule(data: PaymentsInput) {
    const [payments, created] = await this.modelPayments.findOrCreate({
      where: {
        id_agreement: data.id_agreement,
      },
      defaults: {
        ...data,
        status: false,
        /**
         * @TODO
         */
        user: 1,
      },
      logging: console.log,
    });
    if (created) return payments;
  }
  async deletePayment(id: number) {
    return await this.modelPayments.destroy({
      where: {
        id: id,
        // id_agreement: id_agreement,
      },
    });
  }

  /**
   * Get req.
   * @TODO
   * @returns
   */
  async getParallelsCalcs() {
    return;
  }
  /**
   * Метод по изменению статуса в зависимости от внесенных платежей
   * @param body accepting id_payment and id_agreement
   * changing status depending exciting payments from DebtCalcs
   * comparising Year and month
   * @returns updated or not updated status
   * @TODO переделать под связанные долги
   */
  async statusUpdate(body: updateStatusInput) {
    const payment = await this.modelPayments.findOne({
      where: { id: body.id_payment },
    });
    if (payment) console.log('payment finded');
    const agreement = await this.modelAgreement.findOne({
      where: { id: body.id_agreement },
    });
    if (agreement) console.log('agreement finded');
    const debts = await this.modelDebt.findAll({
      where: {
        parent_id: agreement?.person_id,
      },
    });
    const debts_ids = debts.map((item) => item.id);

    const calcs = await this.modelDebtCalc.findAll({
      where: {
        parent_id: {
          [Op.in]: debts_ids,
        },
        purpose: {
          [Op.notIn]: [7] /** требует массивчик */,
        },
      },
      attributes: ['sum', 'calc_date', 'purpose', 'dt'],
    });

    const p_year = moment(payment?.pay_day).year();
    if (!p_year) return;
    const p_month = moment(payment?.pay_day).month();
    if (!p_month) return;

    const payment_month = calcs
      .map((debt) => ({ debt, calc_date: debt.calc_date }))
      .filter((item) => moment(item.calc_date).year() === p_year)
      .filter((item) => moment(item.calc_date).month() === p_month)
      .reduce((prev, curr) => prev + curr.debt.sum, 0);

    console.log('c_in_curr_month: ', payment_month);
    if (!payment?.sum_owe) return;
    if (payment?.sum_owe <= payment_month) {
      payment?.update({ status: true });
      console.log('status updated');
    }
  }
}
