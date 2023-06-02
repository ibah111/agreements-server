import { CreationAttributes } from '@sql-tools/sequelize';
import { Sequelize } from '@sql-tools/sequelize-typescript';
import { program } from 'commander';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { log } from 'console';
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
interface Opts {
  path: string;
}
/**
 * seq
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  models: models,
});
const attributesAgremment = Object.keys(Agreement.getAttributes());
const attributesDebt = Object.keys(AgreementDebtsLink.getAttributes());
type ResultRow = CreationAttributes<Agreement> & {
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
class RegDoc {
  name: string;
  value: CellValue;
}
class Registrator {
  name: string;
  value: CellValue;
}
class Archive {
  name: string;
  value: CellValue;
}
function isRegDoc(value: CellValue, name: string) {
  const new_regDoc: RegDoc = {
    name: 'new_regDoc',
    value: value,
  };
  switch (name) {
    case new_regDoc.name:
      if (value === 'да') {
        return new_regDoc.value === 1 ? 1 : null;
      }
      return null;
  }
}
function isRegistrator(value: CellValue, name: string) {
  const registrator: Registrator = {
    name: 'registrator',
    value: value,
  };
  const new_regDoc: RegDoc = {
    name: 'new_regDoc',
    value: value,
  };
  switch (name) {
    case registrator.name:
      if (value === 'нет') return null;
      else [registrator.value, new_regDoc.value === 2];
  }
}
function isArchive(value: CellValue, name: string) {
  const registrator: Registrator = {
    name: 'registrator',
    value: value,
  };
  const archive: Archive = {
    name: 'archive',
    value: value,
  };
  const new_regDoc: RegDoc = {
    name: 'new_regDoc',
    value: value,
  };
  switch (name) {
    case archive.name:
      if (value === 'нет') return null;
      else return [archive.value === registrator.value, new_regDoc.value === 3];
  }
}
/**
 * Конверт в нужный формат
 * @param value тип ячейки
 * @param name имя ячейки
 * @returns Функция конвертирования в данных их excel в формат SQLite
 */
function convert(value: CellValue, name: string) {
  switch (name) {
    case 'court_sum':
    case 'debt_sum':
    case 'recalculation_sum':
      if (value === '-') return null;
      return value;
    case 'purpose': {
      switch (value) {
        case 'Задолженность взыскана банком':
          return 1;
        case 'Задолженность взыскана нами':
          return 2;
        case 'Пересчет':
          return 3;
        case 'Индексация':
          return 4;
        default:
          throw Error();
      }
    }
    case 'new_regDoc':
      return isRegDoc(value, name);
    // if (value === 'да') return 1;
    // return null;
    case 'registrator':
      return isRegistrator(value, name);
    // if (value === 'нет') return null;
    // return value;
    case 'archive':
      return isArchive(value, name);
    case 'task_link':
      return isHyperLink(value) ? value.hyperlink : value;

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
    {},
    { key: 'court_sum' },
    { key: 'debt_sum' },
    { key: 'recalculation_sum' },
    { key: 'discount_sum' },
    { key: 'discount' },
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
      } catch {}
    }

    for (const row of rows) {
      const debt_data = {} as CreationAttributes<AgreementDebtsLink>;
      for (const attribute of attributesDebt) {
        try {
          const cell = row.getCell(attribute);
          if (cell) debt_data[attribute] = convert(cell.value, attribute);
        } catch {}
      }
      agreement_data.DebtLinks.push(debt_data);
    }
    result.push(agreement_data);
  }
  console.log(result);
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
  importRunned(worksheet_runned);
}
main();
