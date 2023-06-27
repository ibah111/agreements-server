//yarn migrate:excel --path .\Журнал учёта дополнительных соглашений 2.0.xlsx
import { CreationAttributes } from '@sql-tools/sequelize';
import { program } from 'commander';
import { Workbook } from 'exceljs';
import { Agreement } from '../src/Modules/Database/Local.Database/models/Agreement';
import AgreementDebtsLink from '../src/Modules/Database/Local.Database/models/AgreementDebtLink';
import { Debt, Person } from '@contact/models';
import {
  agreementCompensationColumns,
  donedColumns,
  outOfStrengthColumns,
  runnedColumns,
} from './ImportColumnModels';
import innerFunction from './innerFunction';

interface Opts {
  path: string;
}
export type ResultRow = CreationAttributes<Agreement> & {
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
  const donedResults = innerFunction(donedColumns, workbook.worksheets[1]);
  const outOfStrengthResults = innerFunction(
    outOfStrengthColumns,
    workbook.worksheets[2],
  );
  const compensationResults = innerFunction(
    agreementCompensationColumns,
    workbook.worksheets[3],
  );
  /**
   * Действующие
   */
  //TODO ДЕЙСТВУЮЩИЕ STATUS
  for (const result of runnedResults) {
    const debt = result.DebtLinks[0];
    const debtContact = await Debt.findOne({
      where: { id: debt.id_debt },
      attributes: ['id', 'parent_id'],
      raw: true,
    });
    if (debtContact) {
      const agr = await Agreement.create({
        ...result,
        person_id: debtContact.parent_id,
        agreement_type: 1,
        statusAgreement: 1,
      });
      for (const debt of result.DebtLinks) {
        await AgreementDebtsLink.create({
          id_agreement: agr.id,
          id_debt: debt.id_debt,
        });
      }
    }
  }
  console.log('Finished runnedResults');
  for (const result of donedResults) {
    const debt = result.DebtLinks[0];
    const debtContact = await Debt.findOne({
      where: { id: debt.id_debt },
      attributes: ['id', 'parent_id'],
      raw: true,
    });
    if (debtContact) {
      const agr = await Agreement.create({
        ...result,
        person_id: debtContact.parent_id,
        agreement_type: 1,
        statusAgreement: 2,
      });
      for (const debt of result.DebtLinks) {
        await AgreementDebtsLink.create({
          id_agreement: agr.id,
          id_debt: debt.id_debt,
        });
      }
    }
  }
  console.log('Finished donedResults');
  for (const result of outOfStrengthResults) {
    const debt = result.DebtLinks[0];
    const debtContact = await Debt.findOne({
      where: { id: debt.id_debt },
      attributes: ['id', 'parent_id'],
      raw: true,
    });
    if (debtContact) {
      const agr = await Agreement.create({
        ...result,
        agreement_type: 1,
        statusAgreement: 3,
        person_id: debtContact.parent_id,
      });
      for (const debt of result.DebtLinks) {
        await AgreementDebtsLink.create({
          id_agreement: agr.id,
          id_debt: debt.id_debt,
        });
      }
    }
  }
  console.log('Finished outOfStrengthResults');
  /**
   * compensationResults
   */
  for (const result of compensationResults) {
    const debt = result.DebtLinks[0];
    const debtContact = await Debt.findOne({
      where: { id: debt.id_debt },
      include: Person,
    });
    if (debtContact) {
      const agr = await Agreement.create({
        ...result,
        agreement_type: 2,
        statusAgreement: 1,
        person_id: debtContact.parent_id,
      });
      for (const debt of result.DebtLinks) {
        await AgreementDebtsLink.create({
          id_agreement: agr.id,
          id_debt: debt.id_debt,
        });
      }
    }
  }
  console.log('Finished compensationResults');
}
main();
