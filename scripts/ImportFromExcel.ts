import { CreationAttributes } from '@sql-tools/sequelize';
import { Sequelize } from '@sql-tools/sequelize-typescript';
import { program } from 'commander';
import { procesFuncArray } from './PostProcess';
import {
  CellFormulaValue,
  CellHyperlinkValue,
  CellValue,
  Column,
  Row,
  Workbook,
  Worksheet,
} from 'exceljs';
import moment from 'moment';
import { models } from '../src/Modules/Database/Local.Database/models';
import { Agreement } from '../src/Modules/Database/Local.Database/models/Agreement';
import AgreementDebtsLink from '../src/Modules/Database/Local.Database/models/AgreementDebtLink';
import Models, { Debt, Person } from '@contact/models';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  models: models,
  logging: false,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const contactsequelize = new Sequelize({
  dialect: 'mssql',
  host: 'newct.usb.ru',
  database: 'i_collect',
  password: 'contact',
  username: 'contact',
  logging: false,
  models: Models,
});

interface Opts {
  path: string;
}
const attributesAgremment = Object.keys(Agreement.getAttributes());
const attributesDebt = Object.keys(AgreementDebtsLink.getAttributes());
export type ResultRow = CreationAttributes<Agreement> & {
  DebtLinks: CreationAttributes<AgreementDebtsLink>[];
};
function isFormula(value: unknown): value is CellFormulaValue {
  return Object.prototype.hasOwnProperty.call(value, 'formula');
}
function isHyperLink(value: unknown): value is CellHyperlinkValue {
  return (
    Object.prototype.hasOwnProperty.call(value, 'hyperlink') &&
    Object.prototype.hasOwnProperty.call(value, 'text')
  );
}

class CaseClass {
  name: string;
  value: CellValue;
}
/**
 * Конверт в нужный формат
 * @param value тип ячейки
 * @param name имя ячейки
 * @returns Функция конвертирования в данных их excel в формат SQLite
 */
function convert(value: CellValue, name: string) {
  const regDoc: CaseClass = {
    name: 'new_regDoc',
    value: value,
  };
  const registrator: CaseClass = {
    name: 'registrator',
    value: value,
  };
  const archive: CaseClass = {
    name: 'archive',
    value: value,
  };
  switch (name) {
    case 'bank_sum':
      if (value) return value;
    case 'court_sum':
    case 'debt_sum':
    case 'recalculation_sum':
      if (value === '-' || !value) return 0;
      else if (isFormula(value)) return value.result;
      else return value;
    case 'purpose': {
      switch (value?.toString().trim().toLowerCase()) {
        case 'задолженность взыскана банком':
          return 1;
        case 'задолженность взыскана нами':
          return 2;
        case 'пересчёт':
        case 'пересчет':
          return 3;
        case 'индексация':
          return 4;
        default:
          return 5;
        // throw Error();
      }
    }
    case 'agreement_type': {
      if (value === null) return 1;
      else return 1;
    }
    case regDoc.name:
      if (regDoc.value === 'да') return 1;
      return null;
    case registrator.name:
      if (registrator.value === 'нет') return null;
      return registrator.value;
    case archive.name:
      if (archive.value === 'нет') return null;
      return archive.value;
    case 'task_link':
      return isHyperLink(value) ? value.hyperlink : value;
    case 'id_debt':
      if (value) return value;
      return null;

    default:
      if (isFormula(value)) {
        return value.result;
      }
      return value;
  }
}

/**
 * Импортирование
 * @param data Таблица
 */
async function importRunned(data: Worksheet) {
  const predata: Record<string, Row[]> = {};
  const result: ResultRow[] = [];
  const columns: (
    | Partial<Column> & {
        // key?: keyof Attributes<Agreement> | Attributes<AgreementDebtsLink>;
      }
  )[] = [
    {},
    {},
    { key: 'id_debt' },
    {},
    { key: 'conclusion_date' },
    { key: 'fio' },
    { key: 'birth_date' },
    {},
    {},
    { key: 'purpose' },
    { key: 'bank_sum' },
    { key: 'court_sum' },
    { key: 'debt_sum' },
    { key: 'recalculation_sum' },
    { key: 'discount_total' }, // тотал ( который высчитывается)
    { key: 'discount_sum' },
    {},
    {},
    {},
    { key: 'month_pay_day' },
    {},
    {},
    {},
    {},
    { key: 'new_regDoc' },
    { key: 'registrator' },
    { key: 'archive' },
    { key: 'receipt_dt' },
    { key: 'actions_for_get' },
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    { key: 'comment' },
    {},
    { key: 'task_link' },
  ];
  data.columns = columns;
  const rows = data.getRows(2, data.rowCount) || [];
  for (const row of rows) {
    const unique =
      (row.getCell('conclusion_date').value
        ? moment(row.getCell('conclusion_date').value as Date).format(
            'DD.MM.YYYY',
          )
        : '') +
      (row.getCell('fio').value || '').toString() +
      (row.getCell('birth_date').value
        ? moment(row.getCell('birth_date').value as Date).format('DD.MM.YYYY')
        : '');
    if (!predata[unique]) predata[unique] = [];
    predata[unique].push(row);
  }
  for (const rows of Object.values(predata)) {
    const agreement_data = { DebtLinks: [] } as unknown as ResultRow;
    const first = rows[0];
    for (const attribute of attributesAgremment) {
      try {
        const cell = first.getCell(attribute);
        if (cell) agreement_data[attribute] = convert(cell.value, attribute);
      } catch (error) {}
    }

    for (const row of rows) {
      const debt_data = {} as CreationAttributes<AgreementDebtsLink>;
      for (const attribute of attributesDebt) {
        try {
          const cell = row.getCell(attribute);
          if (cell) debt_data[attribute] = convert(cell.value, attribute);
        } catch (error) {}
      }
      agreement_data.DebtLinks.push(debt_data);
    }
    result.push(agreement_data);
  }

  for (const resultRow of result) {
    procesFuncArray.forEach((func) => {
      func(resultRow);
    });
  }
  return result;
}

async function main() {
  const opts = program.option('-p, --path <string>').parse().opts() as Opts;
  const workbook = new Workbook();
  await workbook.xlsx.readFile(opts.path);
  /**
   * обращаться к таблице с помощь массива[] проще, [0] - действующие
   */
  const worksheet_runned = workbook.worksheets[0]; // действующие
  if (!worksheet_runned) return;
  const worksheet_finished = workbook.worksheets[1]; // Исполненные
  if (!worksheet_finished) return;
  const worksheet_break = workbook.worksheets[2]; // Утратившие силу
  if (!worksheet_break) return;
  const worksheet_out = workbook.worksheets[3]; // Соглашения об отсутпном
  if (!worksheet_out) return;
  const results = await importRunned(worksheet_runned);

  await sequelize.transaction(async (transaction) => {
    for (const result of results) {
      const debt = result.DebtLinks[0];
      const debtContact = await Debt.findOne({
        where: { id: debt.id_debt },
        include: Person,
      });
      if (debtContact?.Person) {
        const agr = await Agreement.create(
          {
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
          },
          { transaction },
        );
        for (const debt of result.DebtLinks) {
          await AgreementDebtsLink.create(
            {
              id_agreement: agr.id,
              id_debt: debt.id_debt,
            },
            { transaction },
          );
        }
      }
      continue;
    }
  });
  console.log('Finish');
}
main();
