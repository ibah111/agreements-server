import { CellFormulaValue, CellHyperlinkValue, CellValue } from 'exceljs';

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
export function convert(value: CellValue, name: string) {
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
