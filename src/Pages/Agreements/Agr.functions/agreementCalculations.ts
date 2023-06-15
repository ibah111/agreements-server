import { Person, DebtCalc, Debt, Portfolio } from '@contact/models';
import { Op } from '@sql-tools/sequelize';
import moment from 'moment';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import AgreementDebtsLink from 'src/Modules/Database/Local.Database/models/AgreementDebtLink';
import { AgrGetAllDto } from '../Agr.dto';

export async function agreementCalculation(
  modelPerson: typeof Person,
  modelDebt: typeof Debt,
  modelAgreement: typeof Agreement,
  modelAgreementDebtsLink: typeof AgreementDebtsLink,
  modelPortfolio: typeof Portfolio,
  agreementId: number,
) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const agreement = (await modelAgreement.findOne({
    where: {
      id: agreementId,
    },
    include: [{ model: modelAgreementDebtsLink, separate: true }],
  }))!;

  const debtIdArray: number[] = [];
  for (const link of agreement?.DebtLinks || []) {
    debtIdArray.push(link.id_debt);
  }
  const debts = (await modelDebt.findAll({
    where: { id: { [Op.in]: debtIdArray } },
    include: [
      {
        model: modelPortfolio,
        attributes: ['id', 'name'],
      },
      {
        association: 'DebtCalcs',
      },
    ],
  })) as Debt[];
  const person = await modelPerson.findOne({
    where: { id: agreement?.personId },
    include: [
      {
        association: 'Debts',
      },
    ],
    attributes: ['fio', 'id', 'f', 'i', 'o'],
  });
  //Присоединяем Person
  const dataValuesAgreement = agreement.dataValues as AgrGetAllDto;
  if (person) {
    dataValuesAgreement.Person = person as Person;
  }
  //Присоединяем Debt
  for (const debtLink of agreement.DebtLinks || []) {
    const dataValuesLink = debtLink.dataValues as AgreementDebtsLink;
    dataValuesLink.Debt = debts.find((debt) => debt.id === debtLink.id_debt);
    debtLink.Debt = dataValuesLink.Debt;
  }

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
