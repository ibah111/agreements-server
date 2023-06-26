//yarn migrate:excel --path .\Журнал учёта дополнительных соглашений 2.0.xlsx

import { CreationAttributes } from '@sql-tools/sequelize';
import { program } from 'commander';
import { Workbook } from 'exceljs';
import { Agreement } from '../src/Modules/Database/Local.Database/models/Agreement';
import AgreementDebtsLink from '../src/Modules/Database/Local.Database/models/AgreementDebtLink';
import { Debt, Person } from '@contact/models';
import {
  importCompensationColumns,
  importDoned,
  importOutOfStregth,
  importRunned,
} from './ImportFunctions';

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
async function main() {
  const opts = program.option('-p, --path <string>').parse().opts() as Opts;
  const workbook = new Workbook();
  await workbook.xlsx.readFile(opts.path);
  const worksheet_runned = workbook.worksheets[0];
  if (!worksheet_runned) return;
  const worksheet_doned = workbook.worksheets[1];
  if (!worksheet_doned) return;
  const worksheet_out_of_stregth = workbook.worksheets[2];
  if (!worksheet_out_of_stregth) return;
  const worksheet_compenstaion_columns = workbook.worksheets[3];
  if (!worksheet_compenstaion_columns) return;

  const runnedResults = await importRunned(worksheet_runned);
  const donedResults = await importDoned(worksheet_doned);
  const outOfStrengthResults = await importOutOfStregth(
    worksheet_out_of_stregth,
  );
  const compensationResults = await importCompensationColumns(
    worksheet_compenstaion_columns,
  );

  /**
   * Действующие
   */
  //TODO ДЕЙСТВУЮЩИЕ STATUS
  for (const result of runnedResults) {
    const debt = result.DebtLinks[0];
    const debtContact = await Debt.findOne({
      where: { id: debt.id_debt },
      include: Person,
    });
    if (debtContact?.Person) {
      const agr = await Agreement.create({
        conclusion_date: result.conclusion_date,
        bank_sum: result.bank_sum,
        court_sum: result.court_sum,
        debt_sum: result.debt_sum,
        month_pay_day: result.month_pay_day,
        personId: debtContact.Person.id,
        purpose: result.purpose,
        actions_for_get: result.actions_for_get,
        archive: result.archive,
        comment: result.archive,
        agreement_type: 1,
        discount_sum: result.discount_sum,
        finish_date: result.finish_date,
        new_regDoc: result.new_regDoc,
        recalculation_sum: result.recalculation_sum,
        receipt_dt: result.receipt_dt,
        reg_doc: result.reg_doc,
        registrator: result.registrator,
        statusAgreement: 1,
        task_link: result.task_link,
      });
      for (const debt of result.DebtLinks) {
        await AgreementDebtsLink.create({
          id_agreement: agr.id,
          id_debt: debt.id_debt,
        });
      }
    }
    continue;
  }
  console.log(runnedResults);
  console.log('Finished runnedResults');
  for (const result of donedResults) {
    const debt = result.DebtLinks[0];
    const debtContact = await Debt.findOne({
      where: { id: debt.id_debt },
      include: Person,
    });
    if (debtContact?.Person) {
      const agr = await Agreement.create({
        conclusion_date: result.conclusion_date,
        bank_sum: result.bank_sum,
        court_sum: result.court_sum,
        debt_sum: result.debt_sum,
        month_pay_day: result.month_pay_day,
        personId: debtContact.Person.id,
        purpose: result.purpose,
        actions_for_get: result.actions_for_get,
        archive: result.archive,
        comment: result.archive,
        agreement_type: 1,
        discount_sum: result.discount_sum,
        finish_date: result.finish_date,
        new_regDoc: result.new_regDoc,
        recalculation_sum: result.recalculation_sum,
        receipt_dt: result.receipt_dt,
        reg_doc: result.reg_doc,
        registrator: result.registrator,
        statusAgreement: 2,
        task_link: result.task_link,
      });
      for (const debt of result.DebtLinks) {
        await AgreementDebtsLink.create({
          id_agreement: agr.id,
          id_debt: debt.id_debt,
        });
      }
    }
    continue;
  }
  console.log(donedResults);
  console.log('Finished donedResults');
  for (const result of outOfStrengthResults) {
    const debt = result.DebtLinks[0];
    const debtContact = await Debt.findOne({
      where: { id: debt.id_debt },
      include: Person,
    });
    if (debtContact?.Person) {
      const agr = await Agreement.create({
        conclusion_date: result.conclusion_date,
        bank_sum: result.bank_sum,
        court_sum: result.court_sum,
        debt_sum: result.debt_sum,
        month_pay_day: result.month_pay_day,
        personId: debtContact.Person.id,
        purpose: result.purpose,
        actions_for_get: result.actions_for_get,
        archive: result.archive,
        comment: result.archive,
        agreement_type: 1,
        discount_sum: result.discount_sum,
        finish_date: result.finish_date,
        new_regDoc: result.new_regDoc,
        recalculation_sum: result.recalculation_sum,
        receipt_dt: result.receipt_dt,
        reg_doc: result.reg_doc,
        registrator: result.registrator,
        statusAgreement: 3,
        task_link: result.task_link,
      });
      for (const debt of result.DebtLinks) {
        await AgreementDebtsLink.create({
          id_agreement: agr.id,
          id_debt: debt.id_debt,
        });
      }
    }
    continue;
  }
  console.log(outOfStrengthResults);
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
    if (debtContact?.Person) {
      const agr = await Agreement.create({
        conclusion_date: result.conclusion_date,
        bank_sum: result.bank_sum,
        court_sum: result.court_sum,
        debt_sum: result.debt_sum,
        month_pay_day: result.month_pay_day,
        personId: debtContact.Person.id,
        purpose: result.purpose,
        actions_for_get: result.actions_for_get,
        archive: result.archive,
        comment: result.archive,
        agreement_type: 2,
        discount_sum: result.discount_sum,
        finish_date: result.finish_date,
        new_regDoc: result.new_regDoc,
        recalculation_sum: result.recalculation_sum,
        receipt_dt: result.receipt_dt,
        reg_doc: result.reg_doc,
        registrator: result.registrator,
        statusAgreement: 1,
        task_link: result.task_link,
      });
      for (const debt of result.DebtLinks) {
        await AgreementDebtsLink.create({
          id_agreement: agr.id,
          id_debt: debt.id_debt,
        });
      }
    }
    continue;
  }
  console.log(compensationResults);
  console.log('Finished outOfStrengthResults');
}
main();
