import { CreationAttributes } from '@sql-tools/sequelize';
import { Sequelize } from '@sql-tools/sequelize-typescript';
import { program } from 'commander';
import { log } from 'console';
import {
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
/**
 * Конверт в нужный формат
 * @param value тип ячейки
 * @param name имя ячейки
 * @returns Функция конвертирования в данных их excel в формат SQLite
 */
function convert(value: CellValue, name: string) {
  switch (name) {
    case (name = 'id_debt'):
      return value as number;
    case (name = 'conclusion_date'):
      return value as Date; /* OR => as unknown as moment.Moment; as -||-*/
    case 'fio':
      return value as string;
    case 'birth_date':
      return value as Date; // OR -||-
    case 'purpose': {
      switch (value) {
        case 'Задолженность взыскана банком':
          return value as unknown as 1;
        case 'Задолженность взыскана нами':
          return value as unknown as 2;
        case 'Пересчет':
          return value as unknown as 3;
        case 'Индексация':
          return value as unknown as 4;
      }
      return value as number;
    }
    case 'court_sum':
      return value as number;
    case 'debt_sum':
      return value as number;
    case 'recalculation_sum':
      return value as number;
    case 'discount_sum':
      return value as number;
    case 'discount':
      return value as number;
    case 'month_pay_day':
      return value as number;
    case 'new_regDoc':
      if ((value = 'да')) return (value = 1);
    case 'registrator':
      return value as string;
    case 'receipt_dy':
      return value as Date; // or -||-
    case 'actions_for_get':
      return value as string;
    case 'comment':
      return value as string;
    case 'task_link':
      return (value as string) || (value as CellHyperlinkValue);
    default:
      log(`Не удалость прочитать данные CellValue: ${value}, Name: ${name}`);
      break;
  }
}

/**
 * Импортирование
 * @param data
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
    {},
    { key: 'receipt_dt' },
    {},
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
  console.log(Object.keys(Agreement.getAttributes()));
  for (const rows of Object.values(predata)) {
    const agreement_data = { DebtLinks: [] } as unknown as ResultRow;
    const first = rows[0];
    for (const attribute of attributesAgremment) {
      try {
        const cell = first.getCell(attribute);
        if (cell) agreement_data[attribute] = cell.value;
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
