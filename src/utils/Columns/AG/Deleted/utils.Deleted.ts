import { GridFilterModel, GridSortModel } from '@mui/x-data-grid-premium';
import { Agreement } from 'src/Modules/Database/Local.Database/models/Agreement';
import Filter from 'src/utils/Filter';
import Sort from 'src/utils/Sort';
import { getAttributes } from '../../getAttributes';
import { ResultColumn } from '../../addons';
import deletedColumns from './DeletedColumns';
/**
 * ref идет от удаленных согласов
 * @returns
 */
export function getDeletedUtils() {
  const columns = deletedColumns();
  const utils = {
    generateFilter: (filter: GridFilterModel) => (model: string) =>
      Filter(
        filter,
        columns.filter((item) => item.model === model),
      ),
    getColumns: () => columns,
    getAttributes: (model: string) =>
      getAttributes(columns.filter((item) => item.model === model)),
    generateSort: (sort: GridSortModel) => (base: string) =>
      Sort(
        columns.filter((item) => item.base === base),
        sort,
      ),
    getColumn<T extends keyof Agreement>(name: T) {
      return columns.find(
        (column) => column.field === name,
      ) as unknown as ResultColumn<T>;
    },
  };
  return utils;
}
