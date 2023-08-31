import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Payments } from '../../Modules/Database/Local.Database/models/Payments';
import {
  InputPaymentsUpdate,
  PaymentsInput,
  updateStatusInput,
} from './Payments.input';
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

  addMonths(date: Date, x: number) {
    const d = date.getDate();
    date.setMonth(date.getMonth() + +x);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
  }

  async getSchedule(id_agreement: number) {
    return await this.modelPayments.findAll({
      where: {
        id_agreement: id_agreement,
      },
    });
  }

  async getPayment(id: number) {
    const payment = await this.modelPayments.findOne({
      where: {
        id: id,
      },
    });
    return payment;
  }

  /**
   *
   * @param data model input
   * @param x count of payments
   * @returns possibly array, or one
   */
  async createPaymentsSchedule(data: PaymentsInput, x: number) {
    const agreement = await this.modelAgreement.findOne({
      where: {
        id: data.id_agreement,
      },
      rejectOnEmpty: new NotFoundException(
        'Соглашения не найдено. Возможно оно не существует',
      ),
    });
    await this.modelPayments.create({
      ...data,
      pay_day: data.pay_day,
      id_agreement: agreement.id,
    });
    const date = data.pay_day;
    if (agreement)
      if (x > 1)
        for (let index = 0; index < x - 1; index++) {
          const new_date = this.addMonths(date, 1);
          await this.modelPayments.create({
            ...data,
            id_agreement: agreement.id,
            pay_day: new_date,
          });
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
    } else {
      payment?.update({ status: false });
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

  async updateCalc(body: InputPaymentsUpdate) {
    const [updateNumber] = await this.modelPayments.update(body, {
      where: { id: body.id },
    });
    return updateNumber > 0;
  }

  async updateAllCalcsStatuses() {
    const agreements = await this.modelAgreement.findAll();

    for (const agr of agreements) {
      const payments = await this.modelPayments.findAll({
        where: {
          id_agreement: agr.id,
        },
      });
      console.log(agr.id, payments);
      for (const payment of payments) {
        this.statusUpdate({
          id_payment: payment.id,
          id_agreement: payment.id_agreement,
        });
      }
    }
  }

  async newPaymentLogic(id_agreement: number) {
    /**
     * All payments in agreement.
     */
    const payments = await this.modelPayments.findAll({
      where: {
        id_agreement: id_agreement,
      },
    });
    /**
     * Sum_owe array
     */
    const calcs = payments.map((item) => item.sum_owe);
    /**
     * Total owe
     * @returns условные 30к в agreement = 1
     */
    /**
     * Find Agrs
     */
    const agr = await this.modelAgreement.findOne({
      where: {
        id: id_agreement,
      },
    });
    if (!agr) return;
    /**
     *  debts
     */
    const debt = await this.modelDebt.findAll({
      where: {
        parent_id: agr.person_id,
      },
    });
    const dc = await this.modelDebtCalc.findAll({
      where: {
        parent_id: {
          [Op.in]: debt.map((item) => item.id),
        },
        calc_date: {
          [Op.gte]: agr.conclusion_date,
        },
      },
      attributes: ['parent_id', 'id', 'sum', 'calc_date'],
    });
    const debtCalcs = debt.map((item) =>
      item.DebtCalcs?.map((item) => item.sum),
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const totalDC = debtCalcs.flat().reduce((p, c) => p! + c!, 0);
    const total = calcs.reduce((prev, curr) => prev + curr, 0);
    return [payments, dc];
  }
}
