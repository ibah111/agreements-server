import { Op, WhereOptions } from '@sql-tools/sequelize';
import getItem from './getItem';
import getFieldHandler from '../getFieldHandler';
import { GridFilterModel } from '@mui/x-data-grid-premium';
import { GridColDefAddon } from '../Columns/addons';
export default function Filter(
  filterModel: GridFilterModel,
  columnModel: GridColDefAddon[],
): WhereOptions {
  const where: WhereOptions[] = [];
  const result: Record<symbol, WhereOptions[]> = {};
  const getField = getFieldHandler(columnModel);
  filterModel.items.forEach((item) => {
    const Field = getField(item.field);
    if (Field) where.push(getItem(item, Field!));
  });
  if (filterModel.items.length > 0) {
    switch (filterModel.logicOperator) {
      case 'and':
        result[Op.and] = where;
        break;
      case 'or':
        result[Op.or] = where;
        break;
      default:
        result[Op.and] = where;
        break;
    }
  }
  return result;
}
