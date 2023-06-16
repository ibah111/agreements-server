import { DebtCalc } from '@contact/models';
import moment from 'moment';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import { AgrGetAllDto } from '../Agr.dto';

export function agreementCalculation(agreement: Agreement) {
  //Достаём все истории всех платежей
  const dcd = (agreement.DebtLinks?.map((item) => item.Debt?.DebtCalcs || []) ||
    []) as DebtCalc[][];
  const dc = ([] as DebtCalc[]).concat(...dcd);

  //ALSO Расчет платежей на дату после заключения соглашения
  const calcs = dc
    .filter(
      (item) =>
        moment(agreement.conclusion_date).isBefore(moment(item.dt)) &&
        moment(agreement.finish_date || undefined).isAfter(moment(item.dt)),
    )
    .sort((a, b) => moment(a.dt).diff(moment(b.dt)));

  // расчет на сумму до соглашения
  const calcsBefore = dc.filter((item) =>
    moment(agreement.conclusion_date).isAfter(moment(item.dt)),
  );
  const sumBefore = calcsBefore
    .map((item) => item.sum)
    .reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  const dataValuesAgreement = agreement.dataValues as AgrGetAllDto;
  dataValuesAgreement.sumBeforeAgr = sumBefore;
  // сумма платежей после соглашения
  const sum = calcs
    .map((item) => item.sum)
    .reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  dataValuesAgreement.sumAfterAgr = sum;

  if (calcs.length !== 0) {
    // lp - lastPayment расчет последнего платежа
    const lp = calcs[calcs.length - 1];
    const sumLP = lp.sum;
    dataValuesAgreement.lastPayment = sumLP;
    // lpdate - дата последняя
    const lpdate = lp.dt;
    dataValuesAgreement.lastPaymentDate = lpdate;
    // fp - frstPayment расчет первого платежа
    const fp = calcs[0];
    const sumFP = fp.sum;
    dataValuesAgreement.firstPayment = sumFP;
    // fpdate - дата первого платежа
    const fpdate = fp.dt;
    dataValuesAgreement.firstPaymentDate = fpdate;
  }
  return agreement;
}
