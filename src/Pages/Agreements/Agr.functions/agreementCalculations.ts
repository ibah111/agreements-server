import { DebtCalc } from '@contact/models';
import moment from 'moment';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import { AgrGetAllDto } from '../Agr.dto';

export function agreementCalculation(agreement: Agreement) {
  const id_debt = (agreement.DebtLinks?.map(
    (item) => item.Debt?.DebtCalcs || [],
  ) || []) as DebtCalc[][];
  const payments = ([] as DebtCalc[]).concat(...id_debt);

  const calculations_in_agreements = payments
    .filter(
      (item) =>
        moment(agreement.conclusion_date)
          .startOf('day')
          .isBefore(moment(item.calc_date)) &&
        moment(agreement.finish_date || undefined)
          .endOf('day')
          .isAfter(moment(item.calc_date)),
    )
    .sort((a, b) => moment(a.dt).diff(moment(b.dt)));
  const calcs_before_agreement_conclusion = calculations_in_agreements.filter(
    (item) => moment(agreement.conclusion_date).isAfter(moment(item.dt)),
  );
  const sum_before_agr_conclusion = calcs_before_agreement_conclusion

    .map((item) => item.sum)
    .reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  const dataValuesAgreement = agreement.dataValues as AgrGetAllDto;
  dataValuesAgreement.sumBeforeAgr = sum_before_agr_conclusion;
  const sum_after_agr_conclusion = calculations_in_agreements
    .map((item) => item.sum)
    .reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  dataValuesAgreement.sumAfterAgr = sum_after_agr_conclusion;

  if (calculations_in_agreements.length !== 0) {
    const last_payment_data =
      calculations_in_agreements[calculations_in_agreements.length - 1];
    const sum_last_payment = last_payment_data.sum;
    dataValuesAgreement.lastPayment = sum_last_payment;
    const last_payment_date = last_payment_data.calc_date;
    dataValuesAgreement.lastPaymentDate = last_payment_date;
    const first_payment = calculations_in_agreements[0];
    const first_payment_sum = first_payment.sum;
    dataValuesAgreement.firstPayment = first_payment_sum;
    const first_payment_date = first_payment.calc_date;
    dataValuesAgreement.firstPaymentDate = first_payment_date;
  }
  return agreement;
}
