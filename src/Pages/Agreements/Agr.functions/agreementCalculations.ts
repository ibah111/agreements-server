import { DebtCalc } from '@contact/models';
import moment from 'moment';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import { AgrGetAllDto } from '../Agr.dto';

export function agreementCalculation(agreement: Agreement) {
  const dcd = (agreement.DebtLinks?.map((item) => item.Debt?.DebtCalcs || []) ||
    []) as DebtCalc[][];
  const dc = ([] as DebtCalc[]).concat(...dcd);

  const calcsInAgr = dc
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
  const sum = calcsInAgr
    .filter((item) => [item.is_cancel !== 1])
    .map((item) => item.sum)
    .reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  dataValuesAgreement.sumAfterAgr = sum;

  if (calcsInAgr.length !== 0) {
    const lp = calcsInAgr[calcsInAgr.length - 1];
    const sumLP = lp.sum;
    dataValuesAgreement.lastPayment = sumLP;
    const lpdate = lp.calc_date;
    dataValuesAgreement.lastPaymentDate = lpdate;
    const fp = calcsInAgr[0];
    const sumFP = fp.sum;
    dataValuesAgreement.firstPayment = sumFP;
    const fpdate = fp.calc_date;
    dataValuesAgreement.firstPaymentDate = fpdate;
  }
  return agreement;
}
