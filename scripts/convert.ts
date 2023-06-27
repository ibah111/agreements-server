import {
  CellFormulaValue,
  CellHyperlinkValue,
  CellValue,
  CellRichTextValue,
} from 'exceljs';

function isFormula(value: unknown): value is CellFormulaValue {
  return Object.prototype.hasOwnProperty.call(value, 'formula');
}
function isHyperLink(value: unknown): value is CellHyperlinkValue {
  return (
    Object.prototype.hasOwnProperty.call(value, 'hyperlink') &&
    Object.prototype.hasOwnProperty.call(value, 'text')
  );
}
function isCellRichText(value: unknown): value is CellRichTextValue {
  return Object.prototype.hasOwnProperty.call(value, 'richText');
}
function convertHyperLink(
  value: CellHyperlinkValue,
  name: keyof CellHyperlinkValue = 'hyperlink',
): string {
  if (name === 'text') {
    if (isCellRichText(value.text))
      return value.text.richText.map((item) => item.text).join('');
    return value.text;
  }
  if (name === 'hyperlink') return value.hyperlink;
  throw Error('name not implement');
}
/**
 * Конверт в нужный формат
 * @param value тип ячейки
 * @param name имя ячейки
 * @returns Функция конвертирования в данных их excel в формат SQLite
 */
export function convert(value: CellValue, name: string) {
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
      }
    }
    case 'new_reg_doc':
      if (value === 'да') return 1;
      return null;
    case 'registrator':
    case 'archive':
      if (value === 'нет') return null;
      return value;
    case 'task_link':
      return isHyperLink(value) && convertHyperLink(value);
    case 'id_debt':
      if (value) return value;
      return null;

    default:
      if (isHyperLink(value)) return convertHyperLink(value, 'text');
      if (isFormula(value)) {
        return value.result;
      }
      if (isCellRichText(value)) {
        return value.richText.map((item) => item.text).join('');
      }
      return value;
  }
}
