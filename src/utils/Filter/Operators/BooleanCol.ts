import { Op } from '@sql-tools/sequelize';
type Result = Record<symbol, boolean | Result[]>;
export default function BooleanCol(operator: string, value: string) {
  const result: Result = {};
  switch (operator) {
    case 'is':
      if (value) result[Op.eq] = value === 'true';
      if (!value) {
        result[Op.or] = [{ [Op.eq]: true }, { [Op.eq]: false }];
      }
      break;
  }
  return result;
}
