import { OrderItem } from '@sql-tools/sequelize';
import { GridSortModel } from '@mui/x-data-grid-premium';
import getFieldHandler from '../getFieldHandler';
import getSort from './getSort';
import { GridColDefAddon } from '../Columns/addons';
import { Col, Fn, Literal } from '@sql-tools/sequelize/types/utils';
export type OrderItemColumn = string | Col | Fn | Literal;

export default function Sort(
  columns: GridColDefAddon[],
  sortModel: GridSortModel,
) {
  const getField = getFieldHandler(columns);
  const orders: OrderItem[] = [];
  if (sortModel.length > 0) {
    sortModel.forEach((sort) => {
      const field = getField(sort.field);
      if (field) {
        const operand = getSort(field);
        const order = field.sortOrder || [];
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const item: OrderItem = [...order, operand, sort.sort!];
        orders.push(item);
      }
    });
  } else {
    const item: OrderItem = ['id', 'asc'];
    orders.push(item);
  }
  return orders;
}
