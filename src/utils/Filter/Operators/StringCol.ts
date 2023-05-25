import { Op } from '@sql-tools/sequelize';

export default function StringCol(operator: string, value: string) {
  const result: Record<symbol, string | string[] | null> = {};
  switch (operator) {
    case 'contains':
      result[Op.substring] = `${value}`;
      break;
    case 'notContains':
      result[Op.notLike] = `%${value}%`;
      break;
    case 'equals':
      result[Op.eq] = value;
      break;
    case 'startsWith':
      result[Op.startsWith] = value;
      break;
    case 'endsWith':
      result[Op.endsWith] = value;
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
