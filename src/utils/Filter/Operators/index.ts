import BooleanCol from './BooleanCol';
import DateCol from './DateCol';
import NumericCol from './NumericCol';
import StringCol from './StringCol';
import { GridColType } from '@mui/x-data-grid-premium';
export default function Operators(
  operator: string,
  value: string,
  type: GridColType,
) {
  switch (type) {
    case 'boolean':
      return BooleanCol(operator, value);
    case 'string':
      return StringCol(operator, value);
    case 'number':
      return NumericCol(operator, value || '');
    case 'date':
      return DateCol(operator, value);
    default:
      return StringCol(operator, value);
  }
}
