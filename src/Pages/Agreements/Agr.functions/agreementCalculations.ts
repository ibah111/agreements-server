import { DebtCalc } from '@contact/models';
import moment from 'moment';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import { AgrGetAllDto } from '../Agr.dto';

export function agreementCalculation(agreement: Agreement) {
  const dcd = (agreement.DebtLinks?.map((item) => item.Debt?.DebtCalcs || []) ||
    []) as DebtCalc[][];
  const dc = ([] as DebtCalc[]).concat(...dcd);

  const calcs = dc
    .filter(
      (item) =>
        moment(agreement.conclusion_date)
          .startOf('day')
          .isBefore(moment(item.dt)) &&
        moment(agreement.finish_date || undefined)
          .endOf('day')
          .isAfter(moment(item.dt)),
    )
    .sort((a, b) => moment(a.dt).diff(moment(b.dt)));
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
  const sum = calcs
    .map((item) => item.sum)
    .reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  dataValuesAgreement.sumAfterAgr = sum;

  if (calcs.length !== 0) {
    const lp = calcs[calcs.length - 1];
    const sumLP = lp.sum;
    dataValuesAgreement.lastPayment = sumLP;
    const lpdate = lp.dt;
    dataValuesAgreement.lastPaymentDate = lpdate;
    const fp = calcs[0];
    const sumFP = fp.sum;
    dataValuesAgreement.firstPayment = sumFP;
    const fpdate = fp.dt;
    dataValuesAgreement.firstPaymentDate = fpdate;
    return [sumLP, lpdate, sumFP, fpdate];
  }
  return agreement;
}
