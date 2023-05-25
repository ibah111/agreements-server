import { Op } from '@sql-tools/sequelize';
import moment from 'moment';

export default function DateCol(operator: string, value: string) {
  const result: Record<symbol, Date | Date[] | null> = {};
  const data = moment(value);
  switch (operator) {
    case 'is':
      result[Op.between] = [
        data.startOf('day').toDate(),
        data.endOf('day').milliseconds(997).toDate(),
      ];
      break;
    case 'not':
      result[Op.notBetween] = [
        data.startOf('day').toDate(),
        data.endOf('day').milliseconds(997).toDate(),
      ];
      break;
    case 'after':
      result[Op.gt] = data.toDate();
      break;
    case 'onOrAfter':
      result[Op.gte] = data.toDate();
      break;
    case 'before':
      result[Op.lt] = data.toDate();
      break;
    case 'onOrBefore':
      result[Op.lte] = data.toDate();
      break;
    case 'isEmpty':
      result[Op.is] = null;
      break;
    case 'isNotEmpty':
      result[Op.not] = null;
      break;
  }
  return result;
}
