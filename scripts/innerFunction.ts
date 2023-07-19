import { CreationAttributes } from '@sql-tools/sequelize';
import { Column, Row, Worksheet } from 'exceljs';
import _ from 'lodash';
import moment from 'moment';
import AgreementDebtsLink from '../src/Modules/Database/Local.Database/models/AgreementDebtLink';
import { convert } from './convert';
import {
  attributesAgremment,
  attributesComment,
  attributesDebt,
} from './exportAttributes';
import { ResultRow } from './ImportFromExcel';
import { procesFuncArray } from './PostProcess';
import { Comment } from '../src/Modules/Database/Local.Database/models/Comment';
function createColumnsExcel(
  data: (Partial<Column> & {
    position: number;
  })[],
) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const cols = _.max(data.map((item) => item.position))!;
  // eslint-disable-next-line @typescript-eslint/ban-types
  const columns: (Partial<Column> & {})[] = new Array(cols);
  for (const item of data) {
    const { position, ...col } = item;
    columns[position - 1] = col;
  }
  for (let i = 0; i < columns.length; i++) {
    if (!columns[i]) columns[i] = {};
  }
  return columns;
}
function getCell(row: Row, name: string | number) {
  try {
    return row.getCell(name);
  } catch {}
}
export default function innerFunction(
  // eslint-disable-next-line @typescript-eslint/ban-types
  columns: (Partial<Column> & { position: number })[],
  data: Worksheet,
) {
  const predata: Record<string, Row[]> = {};
  const result: ResultRow[] = [];
  const r_columns = createColumnsExcel(columns);
  data.columns = r_columns;
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
      const cell = getCell(first, attribute);
      if (cell) agreement_data[attribute] = convert(cell.value, attribute);
    }
    const tmp = getCell(first, 'last_check_date');
    if (tmp)
      agreement_data['last_check_date' as string] = convert(
        tmp.value,
        'last_check_date',
      );
    for (const row of rows) {
      const debt_data = {} as CreationAttributes<AgreementDebtsLink>;
      for (const attribute of attributesDebt) {
        const cell = getCell(row, attribute);
        if (cell) debt_data[attribute] = convert(cell.value, attribute);
      }
      const comm_data = {} as CreationAttributes<Comment>;
      for (const attribute_c of attributesComment) {
        const cell = getCell(row, attribute_c);
        if (cell) comm_data[attribute_c] = convert(cell.value, attribute_c);
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
