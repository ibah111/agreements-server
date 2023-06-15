import { Person, DebtCalc, Debt } from '@contact/models';
import { Op } from '@sql-tools/sequelize';
import moment from 'moment';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import AgreementDebtsLink from 'src/Modules/Database/Local.Database/models/AgreementDebtLink';
import { getUtils } from 'src/utils/Columns/Agreements/utils/getUtils';
import getSize from 'src/utils/getSize';
import { AgrGetAllDto } from '../Agr.dto';
import { AgreementsAll } from '../Agr.input';

export async function agreementCalculation(
  modelPerson: typeof Person,
  modelDebt: typeof Debt,
  modelAgreement: typeof Agreement,
  modelAgreementDebtsLink: typeof AgreementDebtsLink,
  body: AgreementsAll,
) {
  const utils = getUtils();
  const size = getSize(body.paginationModel.pageSize);
  const debtIdArray: number[] = [];
  const personIdArray: number[] = [];
  const filter = utils.generateFilter(body.filterModel);
  const persons = modelPerson.findAll({
    where: { id: { [Op.in]: personIdArray } },
    include: [
      {
        association: 'Debts',
      },
    ],
    attributes: ['fio', 'id', 'f', 'i', 'o'],
  });

  const debts = modelDebt.findAll({
    where: {
      id: {
        [Op.in]: debtIdArray,
      },
    },
    include: [
      {
        model: modelDebt,
        attributes: ['id', 'name'],
      },
      {
        association: 'DebtCalcs',
      },
    ],
  }) as unknown as Debt[];
  const agreements_ids = await modelAgreement.findAll({
    attributes: ['id', 'personId'],
    raw: true,
    where: filter('Agreement'),
  });
  const persons_ids = (
    await modelPerson.findAll({
      raw: true,
      where: {
        [Op.and]: [
          {
            id: {
              [Op.in]: agreements_ids.map((agreement) => agreement.personId),
            },
          },
          filter('Person'),
        ],
      },
    })
  ).map((person) => person.id);
  const agreements = (await modelAgreement.findAndCountAll({
    offset: body.paginationModel.page * size,
    limit: size,
    where: {
      [Op.and]: [
        { id: { [Op.in]: agreements_ids.map((agreement) => agreement.id) } },
        { personId: { [Op.in]: persons_ids } },
      ],
    },
    include: [{ model: modelAgreementDebtsLink, separate: true }],
  })) as unknown as { count: number; rows: AgrGetAllDto[] };
  //Перебираем соглашения и добавляем данные
  for (const agreement of agreements.rows) {
    //Присоединяем Person
    const dataValuesAgreement = agreement.dataValues as AgrGetAllDto;
    const person = (await persons).find(
      (person) => person.id === agreement.personId,
    );
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
    const dcd = (agreement.DebtLinks?.map(
      (item) => item.Debt?.DebtCalcs || [],
    ) || []) as DebtCalc[][];
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
  }
  return agreements;
}
