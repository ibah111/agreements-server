import { CreationAttributes } from '@sql-tools/sequelize';
import { Column, Row, Worksheet } from 'exceljs';
import moment from 'moment';
import AgreementDebtsLink from '../src/Modules/Database/Local.Database/models/AgreementDebtLink';
import { convert } from './convert';
import { attributesAgremment, attributesDebt } from './exportAttributes';
import { ResultRow } from './ImportFromExcel';
import { procesFuncArray } from './PostProcess';
function getCell(row: Row, name: string | number) {
  try {
    return row.getCell(name);
  } catch {}
}
export default function innerFunction(
  // eslint-disable-next-line @typescript-eslint/ban-types
  columns: (Partial<Column> & {})[],
  data: Worksheet,
) {
  const predata: Record<string, Row[]> = {};
  const result: ResultRow[] = [];
  const r_columns = columns;
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
