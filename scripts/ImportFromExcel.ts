//yarn migrate:excel --path .\Журнал учёта дополнительных соглашений 2.0.xlsx
import { CreationAttributes, Op } from '@sql-tools/sequelize';
import { program } from 'commander';
import { Workbook } from 'exceljs';
import { Agreement } from '../src/Modules/Database/Local.Database/models/Agreement';
import AgreementDebtsLink from '../src/Modules/Database/Local.Database/models/AgreementDebtLink';
import { Debt } from '@contact/models';
import {
  agreementCompensationColumns,
  donedColumns,
  outOfStrengthColumns,
  runnedColumns,
} from './ImportColumnModels';
import innerFunction from './innerFunction';
import _ from 'lodash';
import { sql } from './exportAttributes';
import moment from 'moment';
interface Opts {
  path: string;
}
export type ResultRow = CreationAttributes<Agreement> & {
  last_check_date: Date;
  DebtLinks: CreationAttributes<AgreementDebtsLink>[];
};
/**
 * Импортирование
 * @param data Таблица
 */
export const workbook = new Workbook();
async function main() {
  const opts = program.option('-p, --path <string>').parse().opts() as Opts;
  await workbook.xlsx.readFile(opts.path);
  const worksheet_runned = workbook.worksheets[0];
  if (!worksheet_runned) return;
  const worksheet_doned = workbook.worksheets[1];
  if (!worksheet_doned) return;
  const worksheet_out_of_stregth = workbook.worksheets[2];
  if (!worksheet_out_of_stregth) return;
  const worksheet_compenstaion_columns = workbook.worksheets[3];
  if (!worksheet_compenstaion_columns) return;

  const runnedResults = innerFunction(runnedColumns, workbook.worksheets[0]);
  const donedResults = innerFunction(
    donedColumns,
    workbook.worksheets[1],
  ).filter((item) =>
    moment(item.conclusion_date).isAfter(moment('2022', 'YYYY')),
  );
  const expiredResults = innerFunction(
    outOfStrengthColumns,
    workbook.worksheets[2],
  ).filter((item) =>
    moment(item.conclusion_date).isAfter(moment('2022', 'YYYY')),
  );
  const compensationResults = innerFunction(
    agreementCompensationColumns,
    workbook.worksheets[3],
  );
  /**
   * Действующие
   */
  //TODO ДЕЙСТВУЮЩИЕ STATUS
  const mapper = (rows: ResultRow[]) =>
    rows.map((item) => item.DebtLinks?.[0].id_debt);
  const debt_ids = _.concat(
    mapper(runnedResults),
    mapper(donedResults),
    mapper(expiredResults),
    mapper(compensationResults),
  );
  const Debts = await Debt.findAll({ where: { id: { [Op.in]: debt_ids } } });
  await sql.transaction(async (t) => {
    for (const result of runnedResults) {
      const debtContactId = Debts.find(
        (item) => item.id === result.DebtLinks[0].id_debt,
      );
      if (debtContactId) {
        await Agreement.create(
          {
            ...result,
            person_id: debtContactId.parent_id,
            agreement_type: 1,
            statusAgreement: 1,

            //@ts-ignore
            DebtLinks: result.DebtLinks.map((debt) => ({
              id_debt: debt.id_debt,
            })),
          },
          {
            include: AgreementDebtsLink,
            transaction: t,
          },
        );
      }
    }
    console.log('Finished runnedResults');
    for (const result of donedResults) {
      const debtContactId = Debts.find(
        (item) => item.id === result.DebtLinks[0].id_debt,
      );
      if (!result.last_check_date) throw Error('Нету finish_date');
      if (debtContactId) {
        await Agreement.create(
          {
            ...result,
            person_id: debtContactId.parent_id,
            agreement_type: 1,
            statusAgreement: 2,
            finish_date: result.last_check_date,
            //@ts-ignore
            DebtLinks: result.DebtLinks.map((debt) => ({
              id_debt: debt.id_debt,
            })),
          },
          {
            include: AgreementDebtsLink,
            transaction: t,
          },
        );
      }
    }
    console.log('Finished donedResults');
    for (const result of expiredResults) {
      const debtContactId = Debts.find(
        (item) => item.id === result.DebtLinks[0].id_debt,
      );
      if (!result.last_check_date) throw Error('Нету finish_date');
      if (debtContactId) {
        await Agreement.create(
          {
            ...result,
            agreement_type: 1,
            statusAgreement: 3,
            person_id: debtContactId.parent_id,
            finish_date: result.last_check_date,
            //@ts-ignore
            DebtLinks: result.DebtLinks.map((debt) => ({
              id_debt: debt.id_debt,
            })),
          },
          { include: AgreementDebtsLink, transaction: t },
        );
      }
    }
    console.log('Finished outOfStrengthResults');
    /**
     * compensationResults
     */
    for (const result of compensationResults) {
      const debtContactId = Debts.find(
        (item) => item.id === result.DebtLinks[0].id_debt,
      );
      if (debtContactId) {
        await Agreement.create(
          {
            ...result,
            agreement_type: 2,
            statusAgreement: 1,
            person_id: debtContactId.parent_id,
            //@ts-ignore
            DebtLinks: result.DebtLinks.map((debt) => ({
              id_debt: debt.id_debt,
            })),
          },
          { include: AgreementDebtsLink, transaction: t },
        );
      }
    }
    console.log('Finished compensationResults');
    console.log('End');
  });
}
main();
