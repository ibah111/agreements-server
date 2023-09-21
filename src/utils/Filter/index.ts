import { Op, WhereOptions } from '@sql-tools/sequelize';
import getItem from '../getItem';
import { GridFilterModel } from '@mui/x-data-grid-premium';
import { GridColDefExtend } from '../Columns/Agreements/AgreementColumns';
import getFieldHandler from '../getFieldHandler';

/**
 * Получить фильтры для sequelize
 * @param filterModel Модель фильтрации
 * @param columnModel Модель колонок
 * @returns Фильтры для sequelize
 */
export default function Filter(
  columnModel: GridColDefExtend[],
  modelName: string,
  filterModel?: GridFilterModel,
): WhereOptions {
  const where: WhereOptions[] = [];
  const result: Record<symbol, WhereOptions[]> = {};
  const getField = getFieldHandler(columnModel, modelName);
  if (filterModel) {
    filterModel.items.forEach((item) => {
      const Field = getField(item.field);
      if (Field) where.push(getItem(item, Field));
    });
    if (filterModel.items.length > 0 && where.length > 0) {
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
  }
  return result;
}
