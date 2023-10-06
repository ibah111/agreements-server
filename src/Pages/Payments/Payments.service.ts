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
import { Op, Sequelize } from '@sql-tools/sequelize';
import moment from 'moment';
import { PaymentToCalc } from '../../Modules/Database/Local.Database/models/PaymentToCalc';
import { ScheduleLinks } from '../../Modules/Database/Local.Database/models/SchedulesLinks';
import { ScheduleType } from '../../Modules/Database/Local.Database/models/ScheduleType';
import AgreementDebtsLink from '../../Modules/Database/Local.Database/models/AgreementDebtLink';
import _ from 'lodash';
import MathService from 'src/Modules/Math/Math.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payments, 'local')
    private readonly modelPayments: typeof Payments,
    @InjectModel(Agreement, 'local')
    private readonly modelAgreement: typeof Agreement,
    @InjectModel(AgreementDebtsLink, 'local')
    private readonly modelAgreementDebtsLink: typeof AgreementDebtsLink,
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
    private readonly mathService: MathService,
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
   * @deprecated
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
   * Реализует л
   * @param id_agreement
   * @returns
   */
  async createCalculationToCalcs(id_schedule: number) {
    const schedule = await this.modelScheduleLinks.findOne({
      where: {
        id: id_schedule,
      },
      include: {
        model: this.modelAgreement,
      },
    });
    if (schedule) {
      const agreement = await this.modelAgreement.findOne({
        where: {
          id: schedule.id_agreement,
        },
        include: {
          model: this.modelAgreementDebtsLink,
        },
      });
      const debt_ids =
        schedule.schedule_type === 2
          ? [schedule.id_debt as number]
          : agreement?.DebtLinks?.map((i) => i.id_debt) || [];
      if (!agreement) return 0;
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
          parent_id: debt_ids,
          calc_date: {
            [Op.between]: [
              moment(schedule.Agreement?.conclusion_date).toDate(),
              moment(schedule.Agreement?.finish_date || undefined).toDate(),
            ],
          },
          is_confirmed: 1,
          is_cancel: 0,
        },
      });
      if (payments.length === 0) return this.checkDebts(agreement, calcs);
      return this.mathService.createPaymentsToCalc(calcs, payments);
    } else {
      return 0;
    }
  }

  async checkDebts(agreement: Agreement, debts: DebtCalc[]) {
    if (
      _(debts)
        .filter(
          (debt) =>
            debt.purpose !== 7 &&
            moment(debt.calc_date).isAfter(moment().add(-1, 'month')),
        )
        .value().length
    )
      agreement.payable_status = true;
    return agreement.save();
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
      const linked_ids =
        agreement.ScheduleLinks?.filter((i) => i.id_debt !== null).map(
          (i) => i.id_debt as number,
        ) || [];
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

  async deleteScheduleLinks(id_schedule: number) {
    return await this.modelScheduleLinks.destroy({
      where: {
        id: id_schedule,
      },
    });
  }
}
