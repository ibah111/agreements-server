import { OrderItem } from '@sql-tools/sequelize';
import { GridSortModel } from '@mui/x-data-grid-premium';
import getSort from './getSort';
import getFieldHandler from '../getFieldHandler';
import { GridColDefExtend } from '../Columns/Agreements/AgreementColumns';

/**
 * Получить операторы сортировки для sequelize
 * @param columns Модель колонок
 * @param sortModel Модель сортировки
 * @returns Оператор сортировки для sequelize
 */
export default function Sort(
  columns: GridColDefExtend[],
  sortModel?: GridSortModel,
) {
  const getField = getFieldHandler(columns);
  const orders: OrderItem[] = [];
  if (sortModel) {
    if (sortModel.length > 0) {
      sortModel.forEach((sort) => {
        const field = getField(sort.field);
        if (field) {
          const value = getSort(field);
          const item: OrderItem = [value, sort.sort ?? 'ASC'];
          orders.push(item);
        }
      });
    } else {
      const item: OrderItem = ['id', 'asc'];
      orders.push(item);
    }
  }
  return orders;
}
