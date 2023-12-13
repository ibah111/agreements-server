import { DebtCalc } from '@contact/models';
import { MIS } from '@sql-tools/sequelize';
import { Payments } from '../Database/Local.Database/models/Payments';
import { HttpException, HttpStatus } from '@nestjs/common';

export default class MathService {
  constructor() {}
  /**
   * Нетрогай, должно работать))))
   * @param calcs
   * @param payments
   */
  async createPaymentsToCalc(calcs: DebtCalc[], payments: MIS<Payments>[]) {
    if (calcs.length === 0) {
      throw new HttpException(
        {
          error: 'Нет платежей для расчёта',
          message: 'Нет платежей для расчёта',
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
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
}
