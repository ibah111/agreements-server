import { GridColDefExtend } from '../Columns/Agreements/AgreementColumns';
import { Utils, Sequelize } from '@sql-tools/sequelize';

/**
 * Получить оператор сортировки из sequelize
 * @param Field Колонка
 * @returns Оператор из sequelize
 */
export default function getSort(Field: GridColDefExtend) {
  if (typeof Field.sortCol === 'string') {
    return Sequelize.col(Field.sortCol);
  } else if (Field.sortCol instanceof Utils.Literal) {
    return Field.sortCol;
  } else {
    return Sequelize.fn(Field.sortCol.name, ...Field.sortCol.args);
  }
}
