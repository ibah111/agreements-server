import { CreationAttributes } from '@sql-tools/sequelize';
import { Sequelize } from '@sql-tools/sequelize-typescript';
import { program } from 'commander';
import { CellValue, Column, Row, Workbook, Worksheet } from 'exceljs';
import moment from 'moment';
import { models } from '../src/Modules/Database/Local.Database/models';
import { Agreement } from '../src/Modules/Database/Local.Database/models/Agreement';
import AgreementDebtsLink from '../src/Modules/Database/Local.Database/models/AgreementDebtLink';
interface Opts {
  path: string;
}
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
function convert(value: CellValue, name: string) {
  return value;
}
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
          const cell = first.getCell(attribute);
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
