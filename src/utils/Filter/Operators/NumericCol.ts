import { Op } from '@sql-tools/sequelize';

export default function NumericCol(operator: string, value: string) {
  const result: Record<symbol, string | string[] | null> = {};
  switch (operator) {
    case 'is':
    case '=':
      result[Op.eq] = value;
      break;
    case 'not':
    case '!=':
      result[Op.not] = value;
      break;
    case '>':
      result[Op.gt] = value;
      break;
    case '>=':
      result[Op.gte] = value;
      break;
    case '<':
      result[Op.lt] = value;
      break;
    case '<=':
      result[Op.lte] = value;
      break;
    case 'isEmpty':
      result[Op.is] = null;
      break;
    case 'isNotEmpty':
      result[Op.not] = null;
      break;
    case 'isAnyOf':
      result[Op.in] = value || [];
      break;
  }
  return result;
}
