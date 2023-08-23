import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Payments } from '../../Modules/Database/Local.Database/models/Payments';
import { PaymentsInput, updateStatusInput } from './Payments.input';
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
    const agreement = await this.modelAgreement.findOne({
      where: {
        id: data.id_agreement,
      },
      rejectOnEmpty: new NotFoundException(
        'Соглашения не найдено. Возможно оно не существует',
      ),
    });
    if (agreement) {
      const payment = await this.modelPayments.create({
        ...data,
        id_agreement: agreement.id,
      });

      return payment;
    }
  }
  async deletePayment(id: number) {
    return await this.modelPayments.destroy({
      where: {
        id: id,
      },
    });
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

    const agreement = await this.modelAgreement.findOne({
      where: { id: body.id_agreement },
    });

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
        // purpose: {
        //   [Op.notIn]: [7] /** требует массивчик */,
        // },
      },
      attributes: ['sum', 'calc_date', 'purpose', 'dt'],
    });

    const p_year = moment(payment?.pay_day).year();
    if (!p_year) return;
    const p_month = moment(payment?.pay_day).month();
    if (!p_month) return;

    const sum_payments_month = calcs
      .map((debt) => ({ debt, calc_date: debt.calc_date }))
      .filter((item) => moment(item.calc_date).year() === p_year)
      .filter((item) => moment(item.calc_date).month() === p_month)
      .reduce((prev, curr) => prev + curr.debt.sum, 0);

    if (!payment?.sum_owe) return;
    if (payment?.sum_owe <= sum_payments_month) {
      payment?.update({ status: true });
    }
  }

  /**
   * Get req.
   * @TODO
   * @returns all payments from DebtCalc that comarison with month and year
   */
  async getCalcsInMonth(id_payment: number) {
    const payment = await this.modelPayments.findOne({
      where: { id: id_payment },
    });

    if (!payment) return;
    const agreement = await this.modelAgreement.findOne({
      where: { id: payment.id_agreement },
    });

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
      },
      attributes: ['id', 'parent_id', 'sum', 'calc_date', 'purpose', 'dt'],
    });

    const p_year = moment(payment?.pay_day).year();
    if (!p_year) return;
    const p_month = moment(payment?.pay_day).month();
    if (!p_month) return;

    const all_payments_month = calcs
      .map((debt) => ({ debt, calc_date: debt.calc_date }))
      .filter((item) => moment(item.calc_date).year() === p_year)
      .filter((item) => moment(item.calc_date).month() === p_month);

    return all_payments_month.map((item) => item.debt);
  }
}
