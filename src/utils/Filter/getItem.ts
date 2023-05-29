import Operators from './Operators';
import { GridFilterItem } from '@mui/x-data-grid-premium';
import { GridColDefAddon } from '../Columns/addons';
import { Sequelize } from '@sql-tools/sequelize';

export default function getItem(item: GridFilterItem, field: GridColDefAddon) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const operator = Operators(item.operator, item.value, field.type!);
  if (typeof field.col !== 'string')
    return Sequelize.where(field.col, operator);
  return {
    [field.col]: operator,
  };
}
