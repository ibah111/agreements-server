import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Injectable } from '@nestjs/common';
import { Payments } from '../../Modules/Database/Local.Database/models/Payments';
import {
  CreateScheduleLink,
  InputPaymentsUpdate,
  PaymentsInput,
  updateStatusInput,
} from './Payments.input';
import { Agreement } from '../../Modules/Database/Local.Database/models/Agreement';
import { Debt, DebtCalc } from '@contact/models';
import { MIS, Op, Sequelize } from '@sql-tools/sequelize';
import moment from 'moment';
import { PaymentToCalc } from '../../Modules/Database/Local.Database/models/PaymentToCalc';
import { ScheduleLinks } from '../../Modules/Database/Local.Database/models/SchedulesLinks';
import { ScheduleType } from '../../Modules/Database/Local.Database/models/ScheduleType';

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
    @InjectModel(PaymentToCalc, 'local')
    private readonly modelPaymentToCalc: typeof PaymentToCalc,
    @InjectModel(ScheduleLinks, 'local')
    private readonly modelScheduleLinks: typeof ScheduleLinks,
    @InjectModel(ScheduleType, 'local')
    private readonly modelScheduleType: typeof ScheduleType,
  ) {}

  /**
   * Не изменять
   */
  async getSchedule(id_schedule: number) {
    return await this.modelPayments.findAll({
      where: {
        id_schedule,
      },
      include: {
        model: this.modelPaymentToCalc,
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
    const schedule = await this.modelScheduleLinks.findOne({});
    if (schedule)
      for (let index = 0; index < x; index++) {
        const new_date = moment(data.pay_day).add(index, 'months').toDate();
        await this.modelPayments.create({
          ...data,
          id_schedule: schedule.id,
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
    const debts_ids = await this.modelPaymentToCalc.findAll({
      where: {
        id_payment,
      },
    });

    const calcs = await this.modelDebtCalc.findAll({
      where: {
        id: {
          [Op.in]: debts_ids.map((i) => i.id_debt_calc),
        },
      },
      attributes: ['id', 'parent_id', 'sum', 'calc_date', 'purpose', 'dt'],
    });

    return calcs;
  }

  async updateCalc(body: InputPaymentsUpdate) {
    const [updateNumber] = await this.modelPayments.update(body, {
      where: { id: body.id },
    });
    return updateNumber > 0;
  }

  /**
   * Нетрогай, должно работать))))
   * @param calcs
   * @param payments
   */
  async createPaymentsToCalc(calcs: DebtCalc[], payments: MIS<Payments>[]) {
    let current_calc = 0;
    let current_pay = 0;
    const last_calc = calcs.length - 1;
    const last_pay = payments.length - 1;
    let wallet = 0;
    while (true) {
      wallet += calcs[current_calc].sum;
      while (true) {
        if (wallet === 0) break;
        const pay = payments[current_pay];
        if (!pay) break;
        const sum_left = pay.sum_left - wallet;

        if (sum_left < 0) {
          wallet -= pay.sum_left;
          pay.sum_left = 0;
        } else {
          pay.sum_left = sum_left;
          wallet = 0;
        }
        await pay.createCalc({ id_debt_calc: calcs[current_calc].id });
        /**
         * Надо написать связь многое ко многим
         * <----  Здесь
         * pay.calcs.push(calcs[current_calc].id);
         * <----  Здесь
         */
        if (pay.sum_left === 0) {
          pay.status = true;
          await pay.save();
          current_pay++;
        }
        if (wallet === 0 || (pay.sum_left > 0 && last_pay === current_pay))
          break;
      }
      if (
        last_calc === current_calc ||
        (wallet > 0 && last_pay === current_pay)
      ) {
        if (payments[current_pay]) await payments[current_pay].save();
        break;
      }
      current_calc++;
    }
    return wallet;
  }

  /**
   * Реализует л
   * @param id_agreement
   * @returns
   */
  async createCalculationToCalcs(id_schedule: number) {
    const schedule = await this.modelScheduleLinks.findOne({
      where: {
        id: id_schedule,
      },
    });
    /**
     * Общий, создаем collection
     */
    if (schedule?.schedule_type === 1) {
      const collection = schedule.Agreement?.DebtLinks?.map((i) => i.id_debt);
      await this.modelPayments.update(
        {
          sum_left: Sequelize.col('sum_owe'),
          status: false,
        },
        {
          where: {
            id_schedule,
          },
        },
      );
      const payments = await this.modelPayments.findAll({
        where: {
          id_schedule,
        },
      });
      await this.modelPaymentToCalc.destroy({
        where: { id_payment: payments.map((item) => item.id) },
      });
      const calcs = await this.modelDebtCalc.findAll({
        raw: true,
        where: {
          parent_id: collection,
          calc_date: {
            [Op.between]: [
              moment(schedule.Agreement?.conclusion_date).toDate(),
              moment(schedule.Agreement?.finish_date || undefined).toDate(),
            ],
          },
        },
      });
      return this.createPaymentsToCalc(calcs, payments);
    } else if (schedule?.schedule_type === 2) {
      /**
       * Индивидуальный, по конкретному долгу
       */
      const single_debt = schedule.id_debt;
      await this.modelPayments.update(
        {
          sum_left: Sequelize.col('sum_owe'),
          status: false,
        },
        {
          where: {
            id_schedule,
          },
        },
      );
      const payments = await this.modelPayments.findAll({
        where: {
          id_schedule,
        },
      });
      await this.modelPaymentToCalc.destroy({
        where: { id_payment: payments.map((item) => item.id) },
      });
      const calcs = await this.modelDebtCalc.findAll({
        raw: true,
        where: {
          parent_id: single_debt,
          calc_date: {
            [Op.between]: [
              moment(schedule.Agreement?.conclusion_date).toDate(),
              moment(schedule.Agreement?.finish_date || undefined).toDate(),
            ],
          },
        },
      });
      return this.createPaymentsToCalc(calcs, payments);
    }
  }

  async updateAllPayments() {
    const agreements = await this.modelAgreement.findAll();
    for (const agreement of agreements) {
      this.createCalculationToCalcs(agreement.id).then(() => {
        console.log(
          `Agreement ${agreement.id} and it's payments must be updated`.green,
        );
      });
    }
  }

  async deleteListOfPayments(list: number[]) {
    return await this.modelPayments.destroy({
      where: {
        id: {
          [Op.in]: list,
        },
      },
    });
  }
  /**
   * @returns типы графика
   */
  async getAllScheduleTypes() {
    return this.modelScheduleType.findAll({
      attributes: ['id', 'title'],
    });
  }
  /**
   * @advice Use NOT.IN operator
   * @param id_agreement
   * @returns
   */
  async getAvailableDebtForSchedule(id_agreement: number) {
    const agreement = await this.modelAgreement.findOne({
      where: {
        id: id_agreement,
      },
    });
    if (agreement) {
      const linked_ids = agreement.ScheduleLinks?.map((i) => i.id_debt) || [];
      const find_debts = await this.modelDebt.findAll({
        where: {
          parent_id: agreement?.person_id,
          id: {
            [Op.notIn]: linked_ids,
          },
        },
        attributes: ['id', 'parent_id', 'contract', 'name', 'status'],
      });
      return find_debts;
    }
  }

  async getAllSchedulesByAgreement(id_agreement: number) {
    return await this.modelScheduleLinks.findAll({
      where: {
        id_agreement,
      },
    });
  }

  async createScheduleLink(body: CreateScheduleLink) {
    const scheduleLink = await this.modelScheduleLinks.create({
      ...body,
    });
    return scheduleLink;
  }
}
