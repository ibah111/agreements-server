import { CreationAttributes } from '@sql-tools/sequelize';
import { Worksheet, Row } from 'exceljs';
import moment from 'moment';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import AgreementDebtsLink from 'src/Modules/Database/Local.Database/models/AgreementDebtLink';
import { convert } from './convert';
import {
  agreementCompensationColumns,
  donedColumns,
  outOfStrengthColumns,
  runnedColumns,
} from './ImportColumnModels';
import { ResultRow } from './ImportFromExcel';
import { procesFuncArray } from './PostProcess';
const attributesAgremment = Object.keys(Agreement.getAttributes());
const attributesDebt = Object.keys(AgreementDebtsLink.getAttributes());
/**
 *
 * @param data
 * @returns импорт Действующих
 */
export async function importRunned(data: Worksheet) {
  const predata: Record<string, Row[]> = {};
  const result: ResultRow[] = [];
  const columns = runnedColumns;
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
export async function importDoned(data: Worksheet) {
  const predata: Record<string, Row[]> = {};
  const result: ResultRow[] = [];
  const columns = donedColumns;
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
export async function importOutOfStregth(data: Worksheet) {
  const predata: Record<string, Row[]> = {};
  const result: ResultRow[] = [];
  const columns = outOfStrengthColumns;
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
export async function importCompensationColumns(data: Worksheet) {
  const predata: Record<string, Row[]> = {};
  const result: ResultRow[] = [];
  const columns = agreementCompensationColumns;
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
